import { json } from '@sveltejs/kit';

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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
    
    // 🔥 CLOUDFLARE WORKERS AI - GRATUIT
    const imageResponse = await platform.env.AI.run(
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      { prompt }
    );
    
    // Convertit en base64 pour affichage direct
    const base64 = arrayBufferToBase64(imageResponse);
    const dataUrl = `data:image/png;base64,${base64}`;
    
    // Sauvegarde en base
    const genId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare(
      'INSERT INTO generations (id, user_id, type, prompt, url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(genId, userId, 'image', prompt, dataUrl, 'preview', now).run();
    
    return json({ success: true, url: dataUrl, id: genId });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
