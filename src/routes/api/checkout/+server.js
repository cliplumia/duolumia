import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const PRICES = {
  starter: 'price_1TZyOcEWOUWbzB3CqJOBxhFw',
  standard: 'price_1TZybSEWOUWbzB3Cpkihq08y',
  pro: 'price_1TZyi9EWOUWbzB3CyN7bfOY1',
  studio: 'price_1TZymdEWOUWbzB3CClmjHBJg'
};

 export async function POST({ request, platform, cookies }) {
  try {
    const secretKey = platform?.env?.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return json({ error: 'Config Stripe manquante' }, { status: 500 });
    }

    // Récupérer l'ID de l'utilisateur connecté
    const userId = cookies.get('user_id') || cookies.get('userid');
    if (!userId) {
      return json({ error: 'Non connecté' }, { status: 401 });
    }

    const stripe = new Stripe(secretKey);
    const { plan } = await request.json();
    
    if (!PRICES[plan]) {
      return json({ error: 'Plan invalide' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      metadata: { user_id: userId }, // ← utilisé par le webhook checkout.session.completed
      subscription_data: { metadata: { user_id: userId } }, // ← utilisé par le webhook invoice.payment_succeeded (renouvellements)
      success_url: 'https://cliplumia.com/dashboard?paid=1',
      cancel_url: 'https://cliplumia.com/dashboard'
    });

    return json({ url: session.url });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
