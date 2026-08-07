const DELAI_ENVOI_MS = 2 * 60 * 1000; // TEST: 2 minutes (remettre a 24 * 60 * 60 * 1000 apres test)

export async function envoyerEmailDemandeAvis(env, user) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante, email avis non envoye');
    return;
  }

  const prenom = (user.nom || '').split(' ')[0] || '';
  const lienAvis = `https://cliplumia.com/avis?uid=${user.id}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #2d1b4e;">
      <h1 style="font-size: 22px; margin: 0 0 20px 0;">Merci d'avoir testé ClipLumia${prenom ? ', ' + prenom : ''} 😁</h1>
      <p style="line-height: 1.7; font-size: 15px;">
        On espère que votre première création vous a plu ! Votre avis compte énormément pour nous, <strong>même négatif</strong> : c'est exactement ce qui nous aide à nous améliorer.
      </p>
      <p style="line-height: 1.7; font-size: 15px;">
        Si vous avez un petit moment, ça nous ferait très plaisir d'avoir votre ressenti 🙏 Et si le cœur vous en dit, vous pourrez aussi choisir d'afficher votre avis sur le site — j'en serais ravie 😉
      </p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${lienAvis}" style="background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728); color: #2d1b4e; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; display: inline-block;">
          Donner mon avis
        </a>
      </p>
      <p style="line-height: 1.7; font-size: 14px; color: #666;">
        Merci encore, et à très vite sur ClipLumia !<br />
        Votre créatrice IA, ClipLumia <span style="color: #8b5cf6;">💜</span>
      </p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ClipLumia <contact@cliplumia.com>',
      to: user.email,
      subject: 'Votre avis compte pour nous 💜',
      html,
      scheduled_at: new Date(Date.now() + DELAI_ENVOI_MS).toISOString()
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Erreur envoi email avis Resend:', err);
    throw new Error(`Resend ${res.status}: ${err}`);
  }
}
