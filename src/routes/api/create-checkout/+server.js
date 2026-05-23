import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

const PRICES = {
  starter: 'price_1TZyOcEWOUWbzB3CqJOBxhFw',
  standard: 'price_1TZybSEWOUWbzB3Cpkihq08y',
  pro: 'price_1TZyi9EWOUWbzB3CyN7bfOY1',
  studio: 'price_1TZymdEWOUWbzB3CClmjHBJg'
};

export async function POST({ request }) {
  const { plan, email } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email, // Pré-remplit l'email
    line_items: [{ price: PRICES[plan], quantity: 1 }],
    success_url: `https://cliplumia.com/dashboard?paid=true`,
    cancel_url: `https://cliplumia.com/dashboard?paid=false`,
    metadata: { plan } // Pour savoir quel plan activer après
  });
  
  return json({ url: session.url });
}
