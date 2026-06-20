import { json } from '@sveltejs/kit';
import Replicate from 'replicate';

export async function POST({ request, platform, cookies }) {
  try {
    const replicate = new Replicate({
      auth: platform.env.REPLICATE_API_TOKEN,
    });

    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id =?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    if (!isAdmin && (user.images_restantes || 0) <= 0) {
      return json({ error: 'Credits images epuises' }, { status: 403 });
    }

    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90
        }
      }
    );

    console.log('Replicate a repondu:', JSON.stringify(output));

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

    // === AJOUT : Créer une entrée dans generations ===
    const generationId = crypto.randomUUID();
    await BD.prepare('INSERT INTO generations (id, user_id, type, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(generationId, userId, 'image', imageUrl, 'en_attente', new Date().toISOString())
      .run();

    if (!isAdmin) {
      await BD.prepare('UPDATE utilisateurs SET images_restantes = images_restantes - 1 WHERE id =?').bind(userId).run();
    }

    // === MODIFICATION : Renvoyer l'ID en plus de l'image ===
    return json({ image: imageUrl, id: generationId });
    
  } catch (error) {
    console.error('Erreur:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
