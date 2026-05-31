import { json } from '@sveltejs/kit';

function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const b64 = base64 + padding;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = [];
  
  for (let i = 0; i < b64.length; i += 4) {
    const c1 = chars.indexOf(b64[i]);
    const c2 = chars.indexOf(b64[i+1]);
    const c3 = chars.indexOf(b64[i+2]);
    const c4 = chars.indexOf(b64[i+3]);
    
    const b1 = (c1 << 2) | (c2 >> 4);
    const b2 = ((c2 & 15) << 4) | (c3 >> 2);
    const b3 = ((c3 & 3) << 6) | c4;
    
    bytes.push(b1);
    if (c3 !== 64) bytes.push(b2);
    if (c4 !== 64) bytes.push(b3);
  }
  
  return JSON.parse(new TextDecoder().decode(new Uint8Array(bytes)));
}

export async function POST({ request, platform, cookies }) {
  try {
    const { token, plan } = await request.json();
    
    if (!token || !plan) {
      return json({ error: 'Token ou plan manquant' }, { status: 400 });
    }

    const BD = platform?.env?.BD;
    if (!BD) {
      return json({ error: 'BD non configuree' }, { status: 500 });
    }

    const payload = decodeJwtPayload(token);
    const email = payload.email;
    const name = payload.name || '';
    const googleId = payload.sub;

    if (!email || !googleId) {
      return json({ error: 'Token invalide' }, { status: 400 });
    }

    const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    const now = new Date().toISOString();

    const existing = await BD.prepare(
      'SELECT id FROM utilisateurs WHERE google_id = ?'
    ).bind(googleId).first();

    let userId;
    if (existing) {
      await BD.prepare(
        'UPDATE utilisateurs SET email = ?, nom = ?, plan = ?, mis_a_jour_a = ? WHERE google_id = ?'
      ).bind(email, name, plan, now, googleId).run();
      userId = existing.id;
    } else {
      await BD.prepare(
        'INSERT INTO utilisateurs (id, google_id, email, nom, plan, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(uid, googleId, email, name, plan, now, now).run();
      userId = uid;
    }

    cookies.set('user_id', userId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return json({ success: true, email: email });

  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

   
