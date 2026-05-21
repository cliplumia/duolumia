<svelte:head>
  <title>ClipLumia - Forfait simple. Zéro arnaque.</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="content">
      <h1 class="logo">ClipLumia</h1>
      <p class="subtitle">Forfait simple. <span>Zéro arnaque.</span></p>

      <div class="arguments">
        <p><strong>✓ STOP LES CRÉDITS :</strong> 80 vidéos/mois. Pas de compteur qui stresse.</p>
        <p><strong>✓ STOP LES VIDÉOS RATÉES :</strong> Tu génères avec filigrane. Tu kiffes ? Tu valides. Tu kiffes pas ? 0€ décompté.</p>
      </div>

      <div class="cta">
        <a href="#forfaits" class="btn-principal">Voir les forfaits dès 9€</a>
      </div>
      <p class="reassurance">Sans engagement. Annule en 2 clics.</p>
    </div>
  </section>

  <!-- FORFAITS -->
  <section id="forfaits" class="forfaits">
    <h2>Choisis ton forfait</h2>
    
    <div class="grille-forfaits">
      
      <!-- STARTER -->
      <div class="carte">
        <h3>Starter</h3>
        <p class="prix">9€<span>/mois</span></p>
        <ul>
          <li>15 vidéos/mois</li>
          <li>50 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Paye que si tu valides</li>
        </ul>
        <a href="/signup?plan=starter" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- STANDARD -->
      <div class="carte">
        <h3>Standard</h3>
        <p class="prix">19€<span>/mois</span></p>
        <ul>
          <li>40 vidéos/mois</li>
          <li>150 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides</li>
        </ul>
        <a href="/signup?plan=standard" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- PRO -->
      <div class="carte highlight">
        <div class="badge">POPULAIRE</div>
        <h3>Pro</h3>
        <p class="prix">39€<span>/mois</span></p>
        <ul>
          <li>80 vidéos/mois</li>
          <li>300 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides</li>
          <li>Support prioritaire</li>
        </ul>
        <a href="/signup?plan=pro" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- STUDIO -->
      <div class="carte">
        <h3>Studio</h3>
        <p class="prix">79€<span>/mois</span></p>
        <ul>
          <li>180 vidéos/mois</li>
          <li>800 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides</li>
          <li>Support prioritaire</li>
        </ul>
        <a href="/signup?plan=studio" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d2066 50%, #2d1b4e 100%);
    background-attachment: fixed;
    color: #fff;
    min-height: 100vh;
  }

  /* HERO */
  .hero {
    min-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 140px 20px 60px 20px;
  }

  .content {
    max-width: 800px;
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 4.5rem; /* GROSSI UN PEU */
    font-weight: 900;
    color: #FFD700; /* OR BRILLANT */
    margin: 0 0 2.5rem 0; /* DESCENDU UN PEU */
    text-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.5);
  }

  .subtitle {
    font-size: 1.5rem;
    margin: 0 0 3rem 0;
    font-weight: 300;
    color: #fff; /* BLANC GARDÉ */
  }

  .subtitle span {
    color: #FFD700; /* OR BRILLANT */
    font-weight: 600;
  }

  .arguments {
    text-align: left;
    max-width: 600px;
    margin: 0 auto 3rem auto;
  }

  .arguments p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin: 1rem 0;
    color: #fff; /* BLANC GARDÉ */
  }

  .arguments strong {
    color: #FFD700; /* OR BRILLANT */
  }

  .cta {
    margin: 2rem 0 1rem 0;
  }

  .btn-principal {
    background: #FFD700; /* OR BRILLANT */
    color: #2d1b4e;
    padding: 16px 40px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    display: inline-block;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
  }

  .btn-principal:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.7);
  }

  .reassurance {
    font-size: 0.9rem;
    color: #fff; /* BLANC GARDÉ */
    margin-top: 1rem;
    opacity: 0.9;
  }

  /* FORFAITS */
  .forfaits {
    padding: 80px 20px;
    background: rgba(0, 0, 0, 0.25);
  }

  .forfaits h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #fff; /* BLANC GARDÉ */
  }

  .grille-forfaits {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .carte {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.3); /* BORDURE OR */
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    position: relative;
    backdrop-filter: blur(10px);
    transition: transform 0.3s, border 0.3s;
  }

  .carte:hover {
    transform: translateY(-5px);
    border-color: #FFD700;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  }

  .carte.highlight {
    border: 2px solid #FFD700; /* OR BRILLANT */
    transform: scale(1.05);
    background: rgba(255, 215, 0, 0.08);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);
  }

  .badge {
    background: #FFD700; /* OR BRILLANT */
    color: #2d1b4e;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
  }

  .carte h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #fff; /* BLANC GARDÉ */
  }

  .prix {
    font-size: 3rem;
    font-weight: 900;
    color: #FFD700; /* OR BRILLANT */
    margin: 0 0 1.5rem 0;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  }

  .prix span {
    font-size: 1rem;
    color: #FFD700; /* OR BRILLANT */
    font-weight: 400;
    opacity: 0.9;
  }

  .carte ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    text-align: left;
  }

  .carte ul li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
    color: #fff; /* BLANC GARDÉ */
  }

  .carte ul li:last-child {
    border-bottom: none;
  }

  .btn {
    background: transparent;
    border: 2px solid #FFD700; /* OR BRILLANT */
    color: #FFD700; /* OR BRILLANT */
    padding: 12px 30px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    display: inline-block;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  .btn:hover {
    background: #FFD700;
    color: #2d1b4e;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }

  .essai {
    font-size: 0.85rem;
    color: #FFD700; /* OR BRILLANT */
    text-align: center;
    margin-top: 0.75rem;
    opacity: 0.9;
  }

  /* MOBILE */
  @media (max-width: 768px) {
    .logo {
      font-size: 3.2rem; /* GROSSI UN PEU AUSSI SUR MOBILE */
    }
    
    .hero {
      padding-top: 100px;
    }

    .carte.highlight {
      transform: scale(1);
    }
  }
</style>
