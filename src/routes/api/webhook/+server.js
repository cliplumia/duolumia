import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

export async function POST({ request, platform }) {
  try {
    const secretKey = platform?.env?.STRIPE_SECRET_KEY;
    const webhookSecret = platform?.env?.STRIPE_WEBHOOK_SECRET;
    
    if (!secretKey || !webhookSecret) {
      return json({ error: 'Config Stripe manquante' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      return json({ error: 'Signature manquante' }, { status: 400 });
    }

    const body = await request.text();
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return json({ error: 'Signature invalide' }, { status: 400 });
    }

    const BD = platform.env.BD;

    // Événement : Paiement réussi (nouvel abonnement)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      
      if (!userId) {
        return json({ error: 'User ID manquant' }, { status: 400 });
      }

      // Récupérer l'abonnement pour avoir le plan
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const priceId = subscription.items.data[0].price.id;
      
      // Déterminer le plan selon le price ID
      let plan = 'starter';
      let videos = 30;
      let images = 100;
      
      if (priceId === 'price_1TP1gEEsGrpQC0pJiMzdzHjo') {
        plan = 'standard';
        videos = 60;
        images = 300;
      } else if (priceId === 'price_1TP1gIEsGrpQC0pJvr1PXmoD') {
        plan = 'pro';
        videos = 120;
        images = 600;
      } else if (priceId === 'price_1Tc71ZEsGrpQC0pJkijNahPK') {
        plan = 'studio';
        videos = 180;
        images = 800;
      }

      // Mettre à jour l'utilisateur dans la base de données
      await BD.prepare(`
        UPDATE utilisateurs 
        SET plan = ?, videos_restantes = ?, images_restantes = ?
        WHERE id = ?
      `).bind(plan, videos, images, userId).run();
    }

    // Événement : Paiement récurrent réussi (renouvellement mensuel)
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const userId = subscription.metadata?.user_id;
      
      if (!userId) {
        return json({ error: 'User ID manquant' }, { status: 400 });
      }

      const priceId = subscription.items.data[0].price.id;
      
      // Réinitialiser les compteurs selon le plan
      let videos = 30;
      let images = 100;
      
      if (priceId === 'price_1TP1gEEsGrpQC0pJiMzdzHjo') {
        videos = 60;
        images = 300;
      } else if (priceId === 'price_1TP1gIEsGrpQC0pJvr1PXmoD') {
        videos = 120;
        images = 600;
      } else if (priceId === 'price_1Tc71ZEsGrpQC0pJkijNahPK') {
        videos = 180;
        images = 800;
      }

      await BD.prepare(`
        UPDATE utilisateurs 
        SET videos_restantes = ?, images_restantes = ?
        WHERE id = ?
      `).bind(videos, images, userId).run();
    }

    return json({ received: true });
    
  } catch (err) {
    console.error('Webhook error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
