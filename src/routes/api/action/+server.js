import { json } from '@sveltejs/kit';
import { envoyerEmailDemandeAvis } from '$lib/server/email.js';

export async function POST({ request, platform, cookies }) {
  try {
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    const { id, action, type = 'image' } = await request.json();
    
    if (!id || !action) return json({ error: 'Parametres manquants' }, { status: 400 });
    
    const generation = await BD.prepare('SELECT * FROM generations WHERE id = ? AND user_id = ?')
      .bind(id, userId).first();
    
    if (!generation) return json({ error: 'Generation introuvable' }, { status: 404 });
    
    if (action === 'validate') {
      if (generation.status === 'valide' && generation.final_token) {
        return json({ success: true, message: 'Deja valide', downloadUrl: `/api/serve?token=${generation.final_token}` });
      }

      if (!isAdmin) {
        if (type === 'video') {
          if ((user.videos_restantes || 0) <= 0) {
            return json({ error: 'Forfait videos epuise' }, { status: 403 });
          }
          await BD.prepare('UPDATE utilisateurs SET videos_restantes = videos_restantes - 1 WHERE id = ?')
            .bind(userId).run();
        } else {
          if ((user.images_restantes || 0) <= 0) {
            return json({ error: 'Forfait images epuise' }, { status: 403 });
          }
          await BD.prepare('UPDATE utilisateurs SET images_restantes = images_restantes - 1 WHERE id = ?')
            .bind(userId).run();
        }
      }

      const finalToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Expire dans 15 min

      await BD.prepare("UPDATE generations SET status = 'valide', final_token = ?, final_token_expires_at = ? WHERE id = ?")
        .bind(finalToken, expiresAt, id).run();

      // Premiere creation validee par ce client : on lui demande son avis (best-effort)
      if (!user.avis_email_envoye) {
        try {
          await envoyerEmailDemandeAvis(platform.env, user);
          await BD.prepare('UPDATE utilisateurs SET avis_email_envoye = 1 WHERE id = ?').bind(userId).run();
        } catch (e) {
          console.error('Envoi email avis echoue, on reessaiera a la prochaine validation:', e);
        }
      }

      const downloadUrl = `/api/serve?token=${finalToken}`;
      return json({ success: true, downloadUrl });
    }

    return json({ error: 'Action inconnue' }, { status: 400 });

  } catch (err) {
    console.error('Action error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}

