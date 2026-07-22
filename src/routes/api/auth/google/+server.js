import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
    const { token } = await request.json();
    if (!token) return json({ error: 'missing' }, { status: 400 });

    const BD = platform?.env?.BD;
    if (!BD) return json({ error: 'no DB' }, { status: 500 });

    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - base64.length % 4) % 4);
    const payload = JSON.parse(atob(base64 + pad));

    if (!payload.email || !payload.sub) return json({ error: 'bad token' }, { status: 400 });

    const now = new Date().toISOString();
    const clientIp = request.headers.get('cf-connecting-ip') || '';

    // === VÉRIFIE SI L'UTILISATEUR EXISTE DÉJÀ ===
    const existing = await BD.prepare('SELECT * FROM utilisateurs WHERE google_id = ?').bind(payload.sub).first();

    const adminEmails = ['dussolliermarjorie@gmail.com', 'contact.cliplumia@gmail.com'];
    const isAdmin = adminEmails.includes(payload.email);

    let id;

    if (existing) {
      id = existing.id;
      await BD.prepare('UPDATE utilisateurs SET mis_a_jour_a = ? WHERE google_id = ?')
        .bind(now, payload.sub).run();
    } else {
      id = crypto.randomUUID();

      if (isAdmin) {
        await BD.prepare('INSERT INTO utilisateurs (id, google_id, email, nom, plan, images_restantes, videos_restantes, voices_restantes, chat_restantes, essai_expire_a, cree_a, mis_a_jour_a, signup_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, payload.sub, payload.email, payload.name || '', 'admin', 999999, 999999, 999999, 999999, null, now, now, clientIp).run();
      } else {
        // Un essai gratuit deja utilise depuis cette IP ? Pas de deuxieme essai.
        const ipDejaUtilisee = clientIp
          ? await BD.prepare('SELECT id FROM utilisateurs WHERE signup_ip = ? AND signup_ip != ""').bind(clientIp).first()
          : null;

        if (ipDejaUtilisee) {
          // Compte cree sans essai gratuit : deja consomme depuis cette adresse
          await BD.prepare('INSERT INTO utilisateurs (id, google_id, email, nom, plan, images_restantes, videos_restantes, voices_restantes, chat_restantes, essai_expire_a, cree_a, mis_a_jour_a, signup_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, payload.sub, payload.email, payload.name || '', 'bloque', 0, 0, 0, 0, null, now, now, clientIp).run();
        } else {
          // NOUVEAU CLIENT : On lui donne FORCÉMENT le forfait GRATUIT pour 48h
          const planInitial = 'gratuit';
          const imagesInitiales = 3;
          const videosInitiales = 3;
          const voixInitiales = 0;
          const chatsInitiaux = 0;
          const essaiExpire = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

          await BD.prepare('INSERT INTO utilisateurs (id, google_id, email, nom, plan, images_restantes, videos_restantes, voices_restantes, chat_restantes, essai_expire_a, cree_a, mis_a_jour_a, signup_ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .bind(id, payload.sub, payload.email, payload.name || '', planInitial, imagesInitiales, videosInitiales, voixInitiales, chatsInitiaux, essaiExpire, now, now, clientIp).run();
        }
      }
    }

    cookies.set('user_id', id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });

    return json({ success: true, email: payload.email });

  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
