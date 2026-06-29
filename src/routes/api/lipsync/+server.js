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
      throw new Error(err.detail || 'Erreur Replicate');
    }

    let data = await replicateRes.json();

    while (data.status === "starting" || data.status === "processing") {
      await new Promise(r => setTimeout(r, 5000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
        headers: { 'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}` }
      });
      data = await pollRes.json();
    }

    if (data.status === "failed") {
      throw new Error(data.error || 'Lipsync echoue');
    }

    const videoUrl = data.output.url || (typeof data.output === 'string' ? data.output : null);

        if (!videoUrl) {
      throw new Error('URL vidéo introuvable');
    }

    // Création de l'entrée dans la base de données pour le suivi
    const generationId = crypto.randomUUID();
    await platform.env.BD.prepare("INSERT INTO generations (id, user_id, type, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(generationId, userId, 'lipsync', videoUrl, 'pending', new Date().toISOString())
      .run();

    console.log('VIDÉO GÉNÉRÉE:', videoUrl);
    return json({ success: true, url: videoUrl, id: generationId });
  }
}
