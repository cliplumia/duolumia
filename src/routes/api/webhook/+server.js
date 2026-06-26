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

    // Événement : Nouveau paiement réussi (premier abonnement)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      
      if (!userId) {
        return json({ error: 'User ID manquant' }, { status: 400 });
      }

      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const priceId = subscription.items.data[0].price.id;
      
      // === TES CHIFFRES EXACTS PAR FORFAIT ===
      let plan = 'starter';
      let videos = 15; let images = 50; let voices = 0; let chats = 20; // Starter par défaut
      
      if (priceId === 'price_1TP1gEEsGrpQC0pJiMzdzHjo') { // STANDARD 19€
        plan = 'standard'; videos = 60; images = 300; voices = 10; chats = 20;
      } else if (priceId === 'price_1TP1gIEsGrpQC0pJvr1PXmoD') { // PRO 39€
        plan = 'pro'; videos = 120; images = 600; voices = 20; chats = 30;
      } else if (priceId === 'price_1Tc71ZEsGrpQC0pJkijNahPK') { // STUDIO 79€
        plan = 'studio'; videos = 180; images = 800; voices = 40; chats = 50;
      }
      // Si c'est le Starter (9€), on garde les valeurs par défaut (15, 50, 0, 20)

      await BD.prepare(`
        UPDATE utilisateurs 
        SET plan = ?, videos_restantes = ?, images_restantes = ?, voices_restantes = ?, chat_restantes = ?
        WHERE id = ?
      `).bind(plan, videos, images, voices, chats, userId).run();
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
      
      let videos = 15; let images = 50; let voices = 0; let chats = 20; // Starter par défaut
      
      if (priceId === 'price_1TP1gEEsGrpQC0pJiMzdzHjo') { // STANDARD
        videos = 60; images = 300; voices = 10; chats = 20;
      } else if (priceId === 'price_1TP1gIEsGrpQC0pJvr1PXmoD') { // PRO
        videos = 120; images = 600; voices = 20; chats = 30;
      } else if (priceId === 'price_1Tc71ZEsGrpQC0pJkijNahPK') { // STUDIO
        videos = 180; images = 800; voices = 40; chats = 50;
      }

      await BD.prepare(`
        UPDATE utilisateurs 
        SET videos_restantes = ?, images_restantes = ?, voices_restantes = ?, chat_restantes = ?
        WHERE id = ?
      `).bind(videos, images, voices, chats, userId).run();
    }

    return json({ received: true });
    
  } catch (err) {
    console.error('Webhook error:', err);
    return json({ error: err.message }, { status: 500 });
  }
}
