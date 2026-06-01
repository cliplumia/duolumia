import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const OPENAI_KEY = platform.env.OPENAI_API_KEY;
    
    if (!OPENAI_KEY) return json({ error: 'OpenAI non configure' }, { status: 500 });
    
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    if (!isAdmin && (user.images_restantes || 0) <= 0) {
      return json({ error: 'Credits images epuises' }, { status: 403 });
    }
    
    const { prompt } = await request.json();
    if (!prompt) return json({ error: 'Prompt manquant' }, { status: 400 });
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1
      })
    });
    
    const openaiData = await response.json();
    if (!response.ok) {
      return json({ error: openaiData.error?.message || 'Erreur OpenAI' }, { status: 500 });
    }
    
    const imageUrl = openaiData.data[0].url;
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
