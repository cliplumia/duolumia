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
        <a href="#tarifs" class="btn-principal">Voir les forfaits dès 9€</a>
        <a href="#demo" class="btn-secondaire">Tester 3 fois gratuit</a>
      </div>
      
      <p class="small">Sans engagement. Annule en 2 clics.</p>
    </div>
  </section>

  <!-- TARIFS -->
  <section id="tarifs" class="section-tarifs">
    <h2>Un forfait. Pas de surprise.</h2>
    <p class="desc">Les vidéos ratées ne comptent jamais. Garantie.</p>
    
    <div class="grille-tarifs">
      <div class="carte">
        <h3>Starter</h3>
        <p class="prix">9€<span>/mois</span></p>
        <ul>
          <li>✓ 15 vidéos/mois</li>
          <li>✓ MiniMax, Gemini, Luma</li>
          <li>✓ Voix IA Lynk</li>
          <li>✓ Paye que si tu valides</li>
        </ul>
        <a href="/signup" class="btn-carte">Commencer</a>
      </div>

      <div class="carte">
        <h3>Standard</h3>
        <p class="prix">19€<span>/mois</span></p>
        <ul>
          <li>✓ 40 vidéos/mois</li>
          <li>✓ MiniMax, Gemini, Luma</li>
          <li>✓ Voix IA Lynk</li>
          <li>✓ Paye que si tu valides</li>
        </ul>
        <a href="/signup" class="btn-carte">Commencer</a>
      </div>

      <div class="carte pro">
        <div class="badge">LE PLUS PRIS</div>
        <h3>Pro</h3>
        <p class="prix">39€<span>/mois</span></p>
        <ul>
          <li>✓ 80 vidéos/mois</li>
          <li>✓ MiniMax, Gemini, Luma</li>
          <li>✓ Voix IA Lynk</li>
          <li>✓ Paye que si tu valides</li>
          <li>✓ Support prioritaire</li>
        </ul>
        <a href="/signup" class="btn-carte-pro">Commencer</a>
      </div>

      <div class="carte">
        <h3>Studio</h3>
        <p class="prix">79€<span>/mois</span></p>
        <ul>
          <li>✓ 180 vidéos/mois</li>
          <li>✓ MiniMax, Gemini, Luma</li>
          <li>✓ Voix IA Lynk</li>
          <li>✓ Paye que si tu valides</li>
          <li>✓ Support prioritaire</li>
        </ul>
        <a href="/signup" class="btn-carte">Commencer</a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>© 2026 ClipLumia. Tous droits réservés.</p>
    <a href="mailto:contact.cliplumia@gmail.com">contact.cliplumia@gmail.com</a>
  </footer>
</main>

<style>
  /* RESET SCROLL OK SUR MOBILE */
  :global(html) {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }
  :global(body) {
    margin: 0;
    padding: 0;
    background: #1c0a2b;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  main {
    width: 100%;
    min-height: 100%;
  }

  /* HERO - PLUS DE 100VH FIXE */
  .hero {
    min-height: auto;
    padding: 80px 20px 60px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: radial-gradient(ellipse at 50% 40%, #3a1859 0%, #1c0a2b 70%);
  }
  .content { max-width: 900px; width: 100%; }
  
  /* LOGO OR VÉRITABLE */
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 72px;
    font-weight: 900;
    margin: 0 0 16px 0;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #D4AF37 0%, #C5A028 25%, #B8860B 50%, #CD9B1D 75%, #D4AF37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.4));
  }
  
  .subtitle {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 32px 0;
    color: #d8b4fe;
  }
  .subtitle span { color: #D4AF37; }
  
  .arguments {
    text-align: left;
    max-width: 600px;
    margin: 0 auto 32px auto;
  }
  .arguments p {
    font-size: 17px;
    color: #e9d5ff;
    margin: 14px 0;
    line-height: 1.5;
  }
  .arguments strong { color: #D4AF37; }
  
  .cta {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .btn-principal {
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: #1c0a2b;
    padding: 16px 28px;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
    font-size: 17px;
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
    border: 1px solid #CD9B1D;
    display: inline-block;
  }
  .btn-secondaire {
    border: 2px solid #D4AF37;
    color: #D4AF37;
    padding: 16px 28px;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
    font-size: 17px;
    display: inline-block;
  }
  .small { font-size: 14px; color: #a78bfa; }

  /* TARIFS */
  .section-tarifs {
    padding: 60px 20px;
    background: #12061c;
    text-align: center;
  }
  .section-tarifs h2 {
    font-size: 36px;
    font-weight: 800;
    margin: 0 0 12px 0;
    color: #D4AF37;
  }
  .desc {
    color: #c4b5fd;
    margin-bottom: 40px;
    font-size: 17px;
  }
  .grille-tarifs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .carte {
    background: #1c0a2b;
    border: 1px solid #3a1859;
    border-radius: 16px;
    padding: 28px 20px;
    text-align: left;
    position: relative;
  }
  .carte.pro {
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    border: 2px solid #CD9B1D;
    color: #1c0a2b;
  }
  .badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: #1c0a2b;
    color: #D4AF37;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    border: 1px solid #D4AF37;
    white-space: nowrap;
  }
  .carte h3 { font-size: 22px; margin: 0 0 12px 0; }
  .carte.pro h3 { color: #1c0a2b; }
  .prix {
    font-size: 42px;
    font-weight: 800;
    margin: 0 0 20px 0;
    color: #D4AF37;
  }
  .carte.pro .prix { color: #1c0a2b; }
  .prix span {
    font-size: 16px;
    color: #a78bfa;
    font-weight: 400;
  }
  .carte.pro .prix span { color: #3a1859; }
  .carte ul {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
  }
  .carte li { margin: 10px 0; color: #e9d5ff; font-size: 15px; }
  .carte.pro li { color: #1c0a2b; font-weight: 600; }
  .btn-carte, .btn-carte-pro {
    display: block;
    width: 100%;
    text-align: center;
    padding: 14px;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
    box-sizing: border-box;
  }
  .btn-carte { 
    background: #D4AF37; 
    color: #1c0a2b; 
  }
  .btn-carte-pro { 
    background: #1c0a2b; 
    color: #D4AF37; 
  }

  /* FOOTER */
  footer {
    padding: 40px 20px;
    text-align: center;
    color: #a78bfa;
    background: #1c0a2b;
    border-top: 1px solid #3a1859;
  }
  footer a { color: #D4AF37; }

  /* MOBILE OPTIMISÉ */
  @media (max-width: 768px) {
    .logo { font-size: 48px; }
    .subtitle { font-size: 22px; }
    .hero { padding: 60px 16px 40px 16px; }
    .arguments p { font-size: 16px; }
    .cta { flex-direction: column; }
    .btn-principal, .btn-secondaire { width: 100%; }
    .section-tarifs { padding: 40px 16px; }
    .section-tarifs h2 { font-size: 28px; }
    .grille-tarifs { grid-template-columns: 1fr; }
  }
</style>

