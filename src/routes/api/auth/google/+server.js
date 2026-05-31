import { json } from '@sveltejs/kit';

function decodeBase64(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  str = str.replace(/=+$/, '');
  for (let i = 0; i < str.length; i += 4) {
    const enc1 = chars.indexOf(str[i]);
    const enc2 = chars.indexOf(str[i+1]);
    const enc3 = chars.indexOf(str[i+2]);
    const enc4 = chars.indexOf(str[i+3]);
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    output += String.fromCharCode(chr1);
    if (enc3 !== 64) output += String.fromCharCode(chr2);
    if (enc4 !== 64) output += String.fromCharCode(chr3);
  }
  return output;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export async function POST({ request, platform }) {
  try {
    const { token, plan } = await request.json();

    if (!token || !plan) {
      return json({ error: 'Token ou plan manquant' }, { status: 400 });
    }

    const BD = platform?.env?.BD;

    if (!BD) {
      return json({ error: 'Binding BD introuvable' }, { status: 500 });
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const payload = JSON.parse(decodeBase64(base64 + padding));

    const userEmail = payload.email;
    const userName = payload.name || '';
    const googleId = payload.sub;

    if (!userEmail || !googleId) {
      return json({ error: 'Token invalide' }, { status: 400 });
    }

    const userId = generateUUID();
    const now = new Date().toISOString();

    const existing = await BD.prepare(
      'SELECT id FROM utilisateurs WHERE google_id = ?'
    ).bind(googleId).first();

    if (existing) {
      await BD.prepare(
        'UPDATE utilisateurs SET email = ?, nom = ?, plan = ?, mis_a_jour_a = ? WHERE google_id = ?'
      ).bind(userEmail, userName, plan, now, googleId).run();

      return json({ success: true, user: { id: existing.id, email: userEmail, name: userName, plan } });
    }

    await BD.prepare(
      'INSERT INTO utilisateurs (id, google_id, email, nom, plan, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, googleId, userEmail, userName, plan, now, now).run();

    return json({ success: true, user: { id: userId, email: userEmail, name: userName, plan } });

  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
