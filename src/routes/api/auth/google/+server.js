import { json } from '@sveltejs/kit';

function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  return JSON.parse(atob(base64 + padding));
}

export async function POST({ request, platform }) {
  try {
    const { token, plan } = await request.json();

    if (!token || !plan) {
      return json({ error: 'Token ou plan manquant' }, { status: 400 });
    }

    const GOOGLE_CLIENT_ID = platform?.env?.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = platform?.env?.GOOGLE_CLIENT_SECRET;
    const DB = platform?.env?.BD;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return json({ error: 'Configuration serveur incomplete' }, { status: 500 });
    }

    const payload = decodeJwtPayload(token);
    const userEmail = payload.email;
    const userName = payload.name || '';
    const googleId = payload.sub;

    if (!userEmail || !googleId) {
      return json({ error: 'Infos utilisateur invalides' }, { status: 400 });
    }

    if (DB) {
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();

      try {
        const existing = await DB.prepare(
          'SELECT id FROM utilisateurs WHERE google_id = ?'
        ).bind(googleId).first();

        if (existing) {
          await DB.prepare(
            'UPDATE utilisateurs SET email = ?, nom = ?, plan = ?, mis_a_jour_a = ? WHERE google_id = ?'
          ).bind(userEmail, userName, plan, now, googleId).run();

          return json({
            success: true,
            user: { id: existing.id, email: userEmail, name: userName, plan }
          });
        } else {
          await DB.prepare(
            'INSERT INTO utilisateurs (id, google_id, email, nom, plan, cree_a, mis_a_jour_a) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(userId, googleId, userEmail, userName, plan, now, now).run();

          return json({
            success: true,
            user: { id: userId, email: userEmail, name: userName, plan }
          });
        }
      } catch (dbError) {
        console.error('Erreur D1:', dbError);
        return json({ error: 'Erreur base de donnees' }, { status: 500 });
      }
    } else {
      return json({
        success: true,
        user: { email: userEmail, name: userName, plan }
      });
    }
  } catch (error) {
    console.error('Erreur serveur:', error);
    return json({ error: 'Erreur authentification', details: error.message }, { status: 500 });
  }
}
