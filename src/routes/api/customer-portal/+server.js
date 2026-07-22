import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

export async function POST({ platform, cookies }) {
  try {
    const secretKey = platform?.env?.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return json({ error: 'Config Stripe manquante' }, { status: 500 });
    }

    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) {
      return json({ error: 'Non connecté' }, { status: 401 });
    }

    const BD = platform.env.BD;
    const user = await BD.prepare('SELECT stripe_customer_id FROM utilisateurs WHERE id = ?').bind(userId).first();

    if (!user?.stripe_customer_id) {
      return json({ error: 'Aucun abonnement actif trouvé pour ce compte' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: 'https://cliplumia.com/dashboard'
    });

    return json({ url: session.url });

  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
