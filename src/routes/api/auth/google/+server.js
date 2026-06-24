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
    
    const now = new Date().toISOString();
    
    // === VÉRIFIE SI L'UTILISATEUR EXISTE DÉJÀ ===
    const existing = await BD.prepare('SELECT * FROM utilisateurs WHERE google_id = ?').bind(payload.sub).first();
    
    const adminEmails = ['dussolliermarjorie@gmail.com', 'contact.cliplumia@gmail.com'];
    const isAdmin = adminEmails.includes(payload.email);
    
    if (existing) {
      // UTILISATEUR EXISTANT → On met juste à jour la date (on ne touche PAS aux compteurs)
      await BD.prepare('UPDATE utilisateurs SET mis_a_jour_a = ? WHERE google_id = ?')
        .bind(now, payload.sub).run();
    } else {
      // NOUVEL UTILISATEUR → On crée le compte
      const id = crypto.randomUUID();
      
      if (isAdmin) {
        await BD.prepare('INSERT INTO utilisateurs (id, google_id, email, nom, plan, images_restantes, videos_restantes, essai_expire_a, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, payload.sub, payload.email, payload.name || '', 'admin', 999999, 999999, null, now, now).run();
      } else {
        const essaiExpire = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        await BD.prepare('INSERT INTO utilisateurs (id, google_id, email, nom, plan, images_restantes, videos_restantes, essai_expire_a, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, payload.sub, payload.email, payload.name || '', plan, 3, 3, essaiExpire, now, now).run();
      }
      
      cookies.set('user_id', id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });
    }
    
    return json({ success: true, email: payload.email });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
