import Stripe from 'stripe';
import { json } from '@sveltejs/kit';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

// ⚠️ TES NOUVEAUX PRICE ID TEST À JOUR
const PRICES = {
  standard: 'price_1TP1gEEsGrpQC0pJiMzdzHjo', // 19€/mois
  pro: 'price_1TP1gIEsGrpQC0pJvr1PXmoD', // 39€/mois 
  studio: 'price_1Tc71ZEsGrpQC0pJkijNahPK' // 79€/mois
};

export async function POST({ request }) {
  const { plan } = await request.json();
  
  // Vérif que le plan existe
  if (!PRICES[plan]) {
    return json({ error: 'Plan invalide' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      // ⚠️ ON ENLÈVE customer_email pour l'instant, Stripe le demandera
      success_url: `https://cliplumia.com/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: 'https://cliplumia.com/inscription',
      metadata: { plan: plan }, // Pour savoir quel plan il a pris
      allow_promotion_codes: true // Si tu veux autoriser les codes promo
    });

    return json({ url: session.url });
    
  } catch (err) {
    return json({ error: err.message }, { status: 500 });
  }
}

