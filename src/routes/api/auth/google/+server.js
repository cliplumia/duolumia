import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const { token, plan } = await request.json();
    if (!token || !plan) return json({ error: 'missing' }, { status: 400 });
    
    const BD = platform?.env?.BD;
    if (!BD) return json({ error: 'no DB' }, { status: 500 });
    
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - base64.length % 4) % 4);
    const payload = JSON.parse(atob(base64 + pad));
    
    if (!payload.email || !payload.sub) return json({ error: 'bad token' }, { status: 400 });
    
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    await BD.prepare('INSERT OR REPLACE INTO utilisateurs (id, google_id, email, nom, plan, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, payload.sub, payload.email, payload.name || '', plan, now, now).run();
    
    cookies.set('user_id', id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });
    
    return json({ success: true, email: payload.email });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
