import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
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
    
    // Cloudflare Workers AI - Gratuit
    const imageResponse = await platform.env.AI.run(
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      { prompt }
    );
    
    // Convertit en base64 pour affichage
    const bytes = new Uint8Array(imageResponse);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const dataUrl = `data:image/png;base64,${base64}`;
    
    // Sauvegarde en base SANS le base64 (trop gros pour D1)
    const genId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'image', prompt, 'cloudflare-ai', 'preview', now).run();
    
    return json({ success: true, url: dataUrl, id: genId });
    
  } catch (err) {
    console.error('Generate error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
