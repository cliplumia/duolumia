export const config = {
  runtime: 'edge',
  maxDuration: 300
};

import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userId');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });

    const user = await platform.env.BD.prepare("SELECT * FROM utilisateurs WHERE id =?").bind(userId).first();
    if (!user) return json({ error: 'Utilisateur introuvable' }, { status: 401 });
    const userEmail = user.email;

    const { image, audio } = await request.json();
    if (!image || !audio) return json({ error: 'Image et audio requis' }, { status: 400 });

    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // NOUVEAU MODÈLE
        version: "prunaai/p-video",
        input: {
          // On garde source_image car tu veux uploader une image, pas une vidéo
          source_image: image,
          driven_audio: audio,
          use_enhancer: true
        }
      })
    });

    if (!replicateRes.ok) {
      const err = await replicateRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }

    let data = await replicateRes.json();

    // LOGIQUE DE POLLING (On attend que le modèle finisse)
    while (data.status === "starting" || data.status === "processing") {
      await new Promise(r => setTimeout(r, 5000)); // attend 5s
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { 'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}` }
      });
      data = await pollRes.json();
    }

    if (data.status === "failed") {
      throw new Error(data.error || 'Lipsync echoue');
    }

    // Récupération de l'URL de résultat
    const videoUrl = data.output.url || (typeof data.output === 'string' ? data.output : null);

    if (!videoUrl) {
      throw new Error('URL vidéo introuvable dans la réponse');
    }

    // Décompte des crédits (uniquement si réussite)
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(userEmail);

    if (!isAdmin) {
      await platform.env.BD.prepare("UPDATE utilisateurs SET voices_restantes = voices_restantes - 1 WHERE id =?")
      .bind(userId).run();
    }

    console.log('VIDÉO GÉNÉRÉE:', videoUrl);
    return json({ success: true, url: videoUrl });

  } catch (err) {
    console.error('Lipsync error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
