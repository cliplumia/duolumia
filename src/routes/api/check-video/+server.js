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
      
      // Mettre à jour la DB avec l'URL
      await BD.prepare("UPDATE generations SET url = ?, status = 'preview' WHERE id = ?")
        .bind(videoUrl, genId).run();
      
      return json({ status: 'succeeded', url: videoUrl });
    } else if (prediction.status === 'failed' || prediction.status === 'canceled') {
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
