import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    if (!isAdmin && (user.videos_restantes || 0) <= 0) {
      return json({ error: 'Credits videos epuises' }, { status: 403 });
    }
    
    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });
    
    // 1. Créer la prédiction chez Replicate SANS attendre
    const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${platform.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "minimax/video-01",
        input: { prompt: prompt }
      })
    });
    
    if (!replicateRes.ok) {
      const err = await replicateRes.json();
      throw new Error(err.detail || 'Erreur Replicate');
    }
    
    const prediction = await replicateRes.json();
    
    // 2. Stocker en DB avec status pending
    const genId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'video', prompt, null, 'pending', now).run();
    
    // 3. Retourner immédiatement l'ID Replicate pour le polling
    return json({ success: true, id: genId, replicateId: prediction.id, status: 'pending' });
    
  } catch (err) {
    console.error('Generate video error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
