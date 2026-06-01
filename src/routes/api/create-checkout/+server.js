import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const PRICES = {
  starter: 'price_1TZyOcEWOUWbzB3CqJOBxhFw',
  standard: 'price_1TP1gEEsGrpQC0pJiMzdzHjo',
  pro: 'price_1TP1gIEsGrpQC0pJvr1PXmoD',
  studio: 'price_1Tc71ZEsGrpQC0pJkijNahPK'
};

export async function POST({ request, platform }) {
  try {
    const secretKey = platform?.env?.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      return json({ error: 'Config Stripe manquante' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    const { plan } = await request.json();
    
    if (!PRICES[plan]) {
      return json({ error: 'Plan invalide' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      success_url: 'https://cliplumia.com/dashboard?paid=1',
      cancel_url: 'https://cliplumia.com/dashboard'
    });

    return json({ url: session.url });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}
