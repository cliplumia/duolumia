<svelte:head>
  <title>Mentions légales - Cliplumia</title>
  <meta name="description" content="Mentions légales de Cliplumia" />
</svelte:head>

<div class="legal-page">
  <h1 class="gold-chrome">Mentions légales</h1>
  
  <section class="legal-section">
    <h2>1. Éditeur du site</h2>
    <p>
      <strong class="gold-chrome">Cliplumia</strong><br>
      Site édité à titre non professionnel par un particulier.<br>
      Email : <a href="mailto:Contact@cliplumia.com" class="gold-chrome">Contact@cliplumia.com</a>
    </p>
    <p class="note">
      Conformément à l'article 6 III-2 de la loi n°2004-575 du 21 juin 2004, 
      l'éditeur a choisi de rester anonyme. Les coordonnées ont été transmises à l'hébergeur.
    </p>
  </section>

  <section class="legal-section">
   <h2>2. Hébergement</h2>
   <p>Ce site est hébergé par <strong>Cloudflare, Inc.</strong></p>
    <p>101 Townsend Street</p>
    <p>San Francisco, CA 94107</p>
    <p>États-Unis</p>
    </section>

  <section class="legal-section">
    <h2>3. Propriété intellectuelle</h2>
    <p>
      L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur. 
      Tous les droits de reproduction sont réservés.
    </p>
  </section>

  <section class="legal-section">
    <h2>4. Données personnelles</h2>
    <p>
      Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. 
      Pour exercer ce droit : <a href="mailto:Contact@cliplumia.com" class="gold-chrome">Contact@cliplumia.com</a>
    </p>
  </section>

  <section class="legal-section">
    <h2>5. Cookies</h2>
    <p>
      Ce site n'utilise pas de cookies de tracking. Seuls des cookies techniques nécessaires au fonctionnement peuvent être déposés.
    </p>
  </section>
</div>

<style>
  .legal-page {
    max-width: 800px;
    margin: 4rem auto;
    padding: 2rem;
    background: #2d1b4e;
    border-radius: 12px;
    border: 2px solid #BF953F;
    color: #fff;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
  }

  .legal-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(191, 149, 63, 0.3);
  }

  .legal-section:last-child {
    border-bottom: none;
  }

  h2 {
    color: #FCF6BA;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
  }

  p {
    line-height: 1.8;
    color: #fff;
    font-size: 1rem;
  }

  .note {
    font-size: 0.9rem;
    color: #ccc;
    font-style: italic;
    margin-top: 1rem;
  }

  a {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: underline;
    text-decoration-color: #BF953F;
    text-underline-offset: 3px;
  }

  a:hover {
    filter: brightness(1.3);
  }

  @media (max-width: 768px) {
    .legal-page {
      margin: 2rem 1rem;
      padding: 1.5rem;
    }
    
    h1 {
      font-size: 2rem;
    }
  }
</style>
