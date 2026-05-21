<svelte:head>
  <title>ClipLumia - Forfait simple. Zéro arnaque.💯</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="content">
      <h1 class="logo">ClipLumia</h1>
      <p class="subtitle">Forfait simple. <span class="gold-chrome">Zéro arnaque.</span></p>

      <div class="arguments">
        <p><strong class="gold-chrome">✓ STOP LES CRÉDITS💰 :</strong> 80 vidéos/mois. Pas de compteur qui stresse.</p>
        <p><strong class="gold-chrome">✓ STOP LES VIDÉOS RATÉES :</strong> Tu génères avec filigrane. Tu kiffes ? Tu valides. Tu kiffes pas ? 0€ décompté.</p>
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
        <p class="prix"><span class="gold-chrome">9€</span><span class="mois">/mois</span></p>
        <ul>
          <li>15 vidéos/mois</li>
          <li>50 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=starter" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- STANDARD -->
      <div class="carte">
        <h3>Standard</h3>
        <p class="prix"><span class="gold-chrome">19€</span><span class="mois">/mois</span></p>
        <ul>
          <li>40 vidéos/mois</li>
          <li>150 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=standard" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- PRO -->
      <div class="carte highlight">
        <div class="badge">POPULAIRE</div>
        <h3>Pro</h3>
        <p class="prix"><span class="gold-chrome">39€</span><span class="mois">/mois</span></p>
        <ul>
          <li>80 vidéos/mois</li>
          <li>300 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides 🔥</li>
          <li>Support prioritaire</li>
        </ul>
        <a href="/signup?plan=pro" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

      <!-- STUDIO -->
      <div class="carte">
        <h3>Studio</h3>
        <p class="prix"><span class="gold-chrome">79€</span><span class="mois">/mois</span></p>
        <ul>
          <li>180 vidéos/mois</li>
          <li>800 images IA/mois</li>
          <li>MiniMax, Gemini, Luma</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides 🔥</li>
          <li>Support prioritaire</li>
        </ul>
        <a href="/signup?plan=studio" class="btn">Commencer</a>
        <p class="essai">Essai gratuit 24h - CB requise</p>
      </div>

    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <p>© 2026 <span class="gold-chrome">ClipLumia</span> - Créé avec ​💗​ par une créatrice</p>
  </footer>
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

  /* GOLD CHROME - LA VRAIE COULEUR */
  .gold-chrome {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.5));
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
    font-size: 5rem; /* GROSSI */
    font-weight: 900;
    margin: 0 0 3rem 0; /* DESCENDU */
    
    /* GOLD CHROME */
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }

  .subtitle {
    font-size: 1.5rem;
    margin: 0 0 3rem 0;
    font-weight: 300;
    color: #fff;
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
    color: #fff;
  }

  .cta {
    margin: 2rem 0 1rem 0;
  }

  .btn-principal {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #2d1b4e;
    padding: 16px 40px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    display: inline-block;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 30px rgba(191, 149, 63, 0.7), inset 0 1px 0 rgba(255,255,255,0.4);
  }

  .btn-principal:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 60px rgba(191, 149, 63, 1), inset 0 1px 0 rgba(255,255,255,0.6);
  }

  .reassurance {
    font-size: 0.9rem;
    color: #fff;
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
    color: #fff;
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
    border: 1px solid rgba(191, 149, 63, 0.5);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    position: relative;
    backdrop-filter: blur(10px);
    transition: transform 0.3s, border 0.3s;
  }

  .carte:hover {
    transform: translateY(-5px);
    border-color: #BF953F;
    box-shadow: 0 0 50px rgba(191, 149, 63, 0.5);
  }

  .carte.highlight {
    border: 2px solid #BF953F;
    transform: scale(1.05);
    background: rgba(191, 149, 63, 0.08);
    box-shadow: 0 0 60px rgba(191, 149, 63, 0.7);
  }

  .badge {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #2d1b4e;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 2px 10px rgba(191, 149, 63, 0.6);
  }

  .carte h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    color: #fff;
  }

  .prix {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1.5rem 0;
  }

  .prix .mois {
    font-size: 1rem;
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
    border-bottom: 1px solid rgba(191, 149, 63, 0.2);
    color: #fff;
  }

  .carte ul li:last-child {
    border-bottom: none;
  }

  .btn {
    background: transparent;
    border: 2px solid #BF953F;
    color: #BF953F;
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
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #2d1b4e;
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.8);
    border-color: transparent;
  }

  .essai {
    font-size: 0.85rem;
    color: #BF953F;
    text-align: center;
    margin-top: 0.75rem;
    opacity: 0.9;
  }

  /* FOOTER */
  .footer {
    text-align: center;
    padding: 40px 20px;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(191, 149, 63, 0.4);
  }

  .footer p {
    font-size: 0.95rem;
    margin: 0;
    color: #fff;
    opacity: 0.8;
  }

  /* MOBILE */
  @media (max-width: 768px) {
    .logo {
      font-size: 3.5rem;
    }
    
    .hero {
      padding-top: 100px;
    }

    .carte.highlight {
      transform: scale(1);
    }
  }
</style>
