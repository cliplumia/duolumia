<svelte:head>
  <title>CGV - ClipLumia</title>
  <meta name="description" content="Conditions Générales de Vente de ClipLumia" />
</svelte:head>

<div class="legal-page">
  <div class="container">
    <h1 class="gold-chrome">Conditions Générales de Vente</h1>
    
    <div class="content">
      <h2>1. Objet</h2>
      <p>Les présentes CGV régissent les relations contractuelles entre ClipLumia et ses clients pour la vente de services numériques.</p>
      
      <p><strong>Important :</strong> En validant votre commande, vous acceptez sans réserve les présentes conditions.</p>
      
      <hr />
      
      <h2>2. Services proposés</h2>
      <p>ClipLumia propose des services de création de contenu numérique et d'outils créatifs en ligne.</p>
      
      <hr />
      
      <h2>3. Prix et paiement</h2>
      <p>Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire ou autre moyen sécurisé.</p>
      
      <p><strong>Paiement 100% sécurisé :</strong> Vos données bancaires ne sont jamais stockées sur nos serveurs.</p>
      
      <hr />
      
      <h2>4. Livraison</h2>
      <p>Les services numériques sont livrés immédiatement après validation du paiement, sauf indication contraire.</p>
      
      <hr />
      
      <h2>5. Droit de rétractation</h2>
      <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement.</p>
      
      <p><strong>Article L221-28 :</strong> Pas de remboursement possible une fois le service numérique délivré et l'exécution commencée.</p>
      
      <hr />
      
      <h2>6. Contact</h2>
      <p>Pour toute question : <strong>contact@cliplumia.com</strong></p>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d206b 50%, #2d1b4e 100%);
    background-attachment: fixed;
    color: #fff;
    min-height: 100vh;
  }
  
  .legal-page {
    min-height: 100vh;
    padding: 4rem 1rem;
  }
  
  .container {
    max-width: 900px;
    margin: 0 auto;
  }
  
  /* GOLD CHROME - LA VRAIE COULEUR */
  .gold-chrome {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 3rem;
    font-weight: 900;
    text-align: center;
    margin: 0 0 3rem 0;
    letter-spacing: 1.5px;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }
  
  .content {
    padding: 0 1rem;
  }
  
  h2 {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    color: #fff;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  strong {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
  }
  
  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(191, 149, 63, 0.5), transparent);
    margin: 2rem 0;
  }
  
  .gold-link {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 700;
  }
  
  .gold-link:hover {
    filter: drop-shadow(0 0 15px rgba(252, 246, 186, 0.8));
  }
  
  @media (max-width: 768px) {
    .gold-chrome { font-size: 2rem; }
    .content { padding: 0; }
  }
</style>

