import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    if (!isAdmin && (user.images_restantes || 0) <= 0) {
      return json({ error: 'Credits images epuises' }, { status: 403 });
    }
    
    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });
    
    // Pollinations.ai - Gratuit, pas besoin de clé API
    const imageUrl = 'https://image.pollinations.ai/prompt/cat?width=1024&height=1024&nologo=true';
    
    const genId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'image', prompt, imageUrl, 'preview', now).run();
    
    return json({ success: true, url: imageUrl, id: genId });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
