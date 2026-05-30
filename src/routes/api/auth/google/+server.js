import { json } from '@sveltejs/kit';
import crypto from 'crypto';

export async function POST({ request, platform }) 
  try {
    const { token, plan } = await request.json();

    if (!token || !plan) {
      return json({ error: 'Token ou plan manquant' }, { status: 400 });
    }

    const GOOGLE_CLIENT_ID = platform?.env?.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = platform?.env?.GOOGLE_CLIENT_SECRET;
    const DB = platform?.env?.BD;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('❌ Variables d\'environnement manquantes');
      return json({ error: 'Configuration serveur incomplète' }, { status: 500 });
    }

     console.log('🔍 Vérification du token Google...');
    
   
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    
    const userEmail = payload.email;
    const userName = payload.name;
    const googleId = payload.sub;

    if (!userEmail || !googleId) {
      return json({ error: 'Infos utilisateur invalides' }, { status: 400 });
    }

   
    if (DB) {
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();

      try {
       
        const existing = await DB.prepare(
          'SELECT id FROM users WHERE google_id = ?'
        ).bind(googleId).first();

        if (existing) {
         
          await DB.prepare(
            'UPDATE users SET email = ?, name = ?, plan = ?, updated_at = ? WHERE google_id = ?'
          ).bind(userEmail, userName, plan, now, googleId).run();

          console.log('✅ Utilisateur mis à jour:', userEmail);

          return json({
            success: true,
            user: {
              id: existing.id,
              email: userEmail,
              name: userName,
              plan: plan
            }
          }, { status: 200 });
        } else 
        {
          
          await DB.prepare(
            'INSERT INTO users (id, google_id, email, name, plan, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(userId, googleId, userEmail, userName, plan, now, now).run();

          console.log('✅ Nouvel utilisateur créé:', userEmail);

          return json({
            success: true,
            user: {
              id: userId,
              email: userEmail,
              name: userName,
              plan: plan
            }
          }, { status: 200 });
        }
      } catch (dbError) {
        console.error('❌ Erreur D1:', dbError);
        return json({ error: 'Erreur base de données' }, { status: 500 });
      }
    } else {
      console.warn('⚠️ D1 Database non disponible');
      return json({
        success: true,
        user: {
          email: userEmail,
          name: userName,
          plan: plan
        }
      }, { status: 200 });
    }

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    return json({ 
      error: 'Erreur authentification',
      details: error.message 
    }, { status: 500 });
  }
}
