import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id =?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    // Vérification stricte du forfait images
    if (!isAdmin && (user.images_restantes || 0) <= 0) {
      return json({ error: 'Forfait images epuise. Passez a un forfait superieur !' }, { status: 403 });
    }

    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });

    const repRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90
        }
      })
    });

    if (!repRes.ok) {
      const err = await repRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }

    const prediction = await repRes.json();

    if (prediction.status !== 'succeeded') {
      throw new Error(prediction.error || 'Generation echouee');
    }

    const output = prediction.output;

    let imageUrl;
    if (Array.isArray(output)) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && typeof output === 'object') {
      imageUrl = output.url || output[0];
    }

    if (!imageUrl) {
      return json({ error: 'Pas d URL retournee', details: output }, { status: 500 });
    }

      // Création entrée dans generations
    const generationId = crypto.randomUUID();
    const finalKey = `images/${generationId}.webp`;

    // Télécharger l'image depuis Replicate et l'uploader dans le bucket R2 privé
    const imageRes = await fetch(imageUrl);
    const imageBuffer = await imageRes.arrayBuffer();
    await platform.env.R2_GENERATIONS_BUCKET.put(finalKey, imageBuffer, {
      httpMetadata: { contentType: 'image/webp' }
    });

    await BD.prepare('INSERT INTO generations (id, user_id, type, url, final_key, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(generationId, userId, 'image', imageUrl, finalKey, 'en_attente', new Date().toISOString())
      .run();

        const previewToken = crypto.randomUUID();
    const previewExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Expire dans 24h

    await BD.prepare("UPDATE generations SET preview_token = ?, preview_token_expires_at = ? WHERE id = ?")
      .bind(previewToken, previewExpiresAt, generationId).run();

    const previewUrl = `/api/serve?token=${previewToken}`;

    return json({ image: previewUrl, id: generationId });
    
  } catch (error) {
    console.error('Erreur:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
