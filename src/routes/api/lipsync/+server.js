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

    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(userEmail);
    
    const { image, audio, prompt } = await request.json();
    if (!image || !audio) return json({ error: 'Image et audio requis' }, { status: 400 });

    // Jusqu'a 2 tentatives : Replicate a parfois une erreur ponctuelle de routage interne
    // (ex: "Director: unexpected error handling prediction"), sans rapport avec notre code.
    const MAX_TENTATIVES = 2;
    let data;
    let derniereErreur;

    for (let tentative = 1; tentative <= MAX_TENTATIVES; tentative++) {
      const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "prunaai/p-video",
          input: {
            image: image,
            audio: audio,
            prompt: prompt || "La personne sur l'image parle naturellement, haute qualité",
            duration: 10,
            fps: 24,
            resolution: "720p",
            aspect_ratio: "16:9",
            save_audio: true,
            prompt_upsampling: false,
            disable_safety_filter: true,
            draft: false,
            no_op: false
          }
        })
      });

      if (!replicateRes.ok) {
        const err = await replicateRes.json();
        derniereErreur = err.detail || 'Erreur Replicate';
        continue;
      }

      let tentativeData = await replicateRes.json();

      while (tentativeData.status === "starting" || tentativeData.status === "processing") {
        await new Promise(r => setTimeout(r, 5000));
        const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${tentativeData.id}`, {
          headers: { 'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}` }
        });
        tentativeData = await pollRes.json();
      }

      if (tentativeData.status !== "failed") {
        data = tentativeData;
        break;
      }

      derniereErreur = tentativeData.error || 'Lipsync echoue';
    }

    if (!data) {
      throw new Error(derniereErreur || 'Lipsync echoue');
    }

    const videoUrl = data.output.url || (typeof data.output === 'string' ? data.output : null);

    if (!videoUrl) {
      throw new Error('URL vidéo introuvable');
    }

    const generationId = crypto.randomUUID();
    const finalKey = `lipsync/${generationId}.mp4`;

    // Télécharger la vidéo depuis Replicate et l'uploader dans le bucket R2 privé
    const videoRes = await fetch(videoUrl);
    const videoBuffer = await videoRes.arrayBuffer();
    await platform.env.R2_GENERATIONS_BUCKET.put(finalKey, videoBuffer, {
      httpMetadata: { contentType: 'video/mp4' }
    });

       // Créer le token de preview (valable 24h)
    const previewToken = crypto.randomUUID();
    const previewExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Création de l'entrée dans la base de données pour le suivi
    await platform.env.BD.prepare("INSERT INTO generations (id, user_id, type, url, final_key, preview_token, preview_token_expires_at, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(generationId, userId, 'lipsync', videoUrl, finalKey, previewToken, previewExpiresAt, 'pending', new Date().toISOString()).run();

    const previewUrl = `/api/serve?token=${previewToken}`;

    console.log('VIDÉO GÉNÉRÉE:', videoUrl);
    return json({ success: true, url: previewUrl, id: generationId });

    console.log('VIDÉO GÉNÉRÉE:', videoUrl);
    return json({ success: true, url: videoUrl, id: generationId });
    
  }
  catch (err) {
    console.error('Lipsync error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
