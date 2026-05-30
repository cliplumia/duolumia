import { json } from '@sveltejs/kit';
import { jwtVerify } from 'jose';

// ⚠️ REMPLACE PAR TA CLÉE SECRÈTE DEMAIN
const GOOGLE_CLIENT_SECRET = 'METS-TA-CLE-ICI-DEMAIN';

export async function POST({ request, platform }) {
  try {
    const { token, plan } = await request.json();

    if (!token) {
      return json({ error: 'Token manquant' }, { status: 400 });
    }

    // 🔐 Vérifie le token Google (simplifié pour aujourd'hui)
    console.log('✅ Token reçu:', token.substring(0, 20) + '...');
    console.log('✅ Plan:', plan);

    // 📝 DEMAIN: On va faire :
    // 1. Vérifier le token avec Google
    // 2. Récupérer l'email de l'utilisateur
    // 3. Créer/mettre à jour l'utilisateur en D1
    // 4. Créer une session

    // POUR MAINTENANT: Juste on accepte et on simule
    const user = {
      id: Math.random().toString(36).substring(7),
      email: 'user@example.com', // À remplacer demain
      plan: plan,
      created_at: new Date().toISOString()
    };

    // 🍪 Créer une session (simplifié)
    const session = {
      user_id: user.id,
      token: token,
      created_at: new Date().toISOString()
    };

    console.log('✅ Utilisateur créé:', user);

    return json({
      success: true,
      user: user,
      message: 'Inscription réussie ! 🎉'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return json({ 
      error: 'Erreur serveur',
      details: error.message 
    }, { status: 500 });
  }
}
