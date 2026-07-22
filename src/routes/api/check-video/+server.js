import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const { replicateId, genId } = await request.json();
    if (!replicateId || !genId) return json({ error: 'Parametres manquants' }, { status: 400 });
    
    const BD = platform.env.BD;
    
    // Vérifier le statut chez Replicate
    const res = await fetch(`https://api.replicate.com/v1/predictions/${replicateId}`, {
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const err = await res.json();
      return json({ error: err.detail || 'Erreur check' }, { status: 500 });
    }
    
    const prediction = await res.json();
    
    if (prediction.status === 'succeeded') {
      const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      const finalKey = `videos/${genId}.mp4`;

      // Télécharger la vidéo depuis Replicate et l'uploader dans le bucket R2 privé
      const videoRes = await fetch(videoUrl);
      const videoBuffer = await videoRes.arrayBuffer();
      await platform.env.R2_GENERATIONS_BUCKET.put(finalKey, videoBuffer, {
        httpMetadata: { contentType: 'video/mp4' }
      });

      // Créer le token de preview (valable 24h)
      const previewToken = crypto.randomUUID();
      const previewExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      // Mettre à jour la DB
      await BD.prepare("UPDATE generations SET url = ?, final_key = ?, preview_token = ?, preview_token_expires_at = ?, status = 'preview' WHERE id = ?")
        .bind(videoUrl, finalKey, previewToken, previewExpiresAt, genId).run();
      
      const previewUrl = `/api/serve?token=${previewToken}`;
      return json({ status: 'succeeded', url: previewUrl });

    } else if (prediction.status === 'failed' || prediction.status === 'canceled') {
      // Jusqu'a 1 nouvelle tentative : Replicate a parfois une erreur ponctuelle de
      // routage interne (ex: "Director: unexpected error handling prediction"),
      // sans rapport avec notre code.
      const generation = await BD.prepare('SELECT prompt, retry_count FROM generations WHERE id = ?').bind(genId).first();
      const retryCount = generation?.retry_count || 0;

      if (generation?.prompt && retryCount < 1) {
        const retryRes = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            version: "minimax/video-01",
            input: { prompt: generation.prompt }
          })
        });

        if (retryRes.ok) {
          const retryPrediction = await retryRes.json();
          await BD.prepare('UPDATE generations SET retry_count = retry_count + 1 WHERE id = ?').bind(genId).run();
          return json({ status: 'pending', replicateId: retryPrediction.id });
        }
      }

      await BD.prepare("UPDATE generations SET status = 'failed' WHERE id = ?")
        .bind(genId).run();
      return json({ status: 'failed', error: 'Generation echoue' });
    } else {
      // still starting / processing
      return json({ status: 'pending' });
    }
    
  } catch (err) {
    console.error('Check video error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
