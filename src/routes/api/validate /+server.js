import { json } from '@sveltejs/kit';

export async function POST({ request, platform, cookies }) {
  try {
   const userId = cookies.get('userid');
   if (!userId) return json({ error: 'Non connecte' }, { status: 401 });
    
    const BD = platform.env.BD;
    const { id, action } = await request.json();
    
    if (!id || !action) return json({ error: 'Parametres manquants' }, { status: 400 });
    
    const user = await BD.prepare('SELECT * FROM utilisateurs WHERE id = ?').bind(userId).first();
    
    // ✅ AJOUT IMPORTANT : vérifier que l'utilisateur existe
    if (!user) return json({ error: 'Utilisateur inconnu' }, { status: 404 });
    
    const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(user.email);
    
    if (action === 'validate') {
      await BD.prepare('UPDATE generations SET status = ? WHERE id = ?').bind('validated', id).run();
      
      if (!isAdmin) {
        await BD.prepare('UPDATE utilisateurs SET images_restantes = images_restantes - 1 WHERE id = ?').bind(userId).run();
      }
      
      return json({ success: true, message: 'Valide' });
    }
    
    if (action === 'reject') {
      await BD.prepare('UPDATE generations SET status = ? WHERE id = ?').bind('rejected', id).run();
      return json({ success: true, message: 'Rejete' });
    }
    
    return json({ error: 'Action inconnue' }, { status: 400 });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

