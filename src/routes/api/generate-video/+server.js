import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    // Vérification stricte du forfait vidéos
    if (!isAdmin && (user.videos_restantes || 0) <= 0) {
      return json({ error: 'Forfait videos epuise. Passez a un forfait superieur !' }, { status: 403 });
    }

    // Limite anti-cout : max 4 apercus non valides par type sur 24h (fail-safe : ne bloque pas si erreur)
    if (!isAdmin) {
      try {
        const depuis = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const apercus = await BD.prepare(
          "SELECT COUNT(*) AS n FROM generations WHERE user_id = ? AND type = ? AND status != 'valide' AND created_at > ?"
        ).bind(userId, 'video', depuis).first();
        if (apercus && (apercus.n || 0) >= 4) {
          return json({ error: 'Tu as utilise tes 4 essais pour cette video. Valides-en une, ou reessaie plus tard.' }, { status: 429 });
        }
      } catch (e) {
        console.error('Comptage apercus video (non bloquant):', e);
      }
    }

    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });

    // Envoi sans attendre (pas de Prefer: wait)
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
    
    // Stocker en DB avec url vide et status pending
    const genId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'video', prompt, '', 'pending', now).run();
    
    // Retourner immédiatement l'ID pour le polling
    return json({ success: true, id: genId, replicateId: prediction.id, status: 'pending' });
    
  } catch (err) {
    console.error('Generate video error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
