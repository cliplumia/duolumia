<svelte:head>
  <title>CGV - Cliplumia</title>
  <meta name="description" content="Conditions Générales de Vente de Cliplumia" />
</svelte:head>

<div class="legal-page">
  <div class="container">
    <h1 class="gold-chrome">Conditions Générales de Vente</h1>
    
    <div class="card">
      <h2>1. Objet</h2>
      <p>Les présentes CGV régissent les relations contractuelles entre Cliplumia et ses clients pour la vente de services numériques.</p>
      
      <div class="black-highlight">
        <strong>Important :</strong> En validant votre commande, vous acceptez sans réserve les présentes conditions.
      </div>
      
      <hr />
      
      <h2>2. Services proposés</h2>
      <p>Cliplumia propose des services de création de contenu numérique et d'outils créatifs en ligne.</p>
      
      <hr />
      
      <h2>3. Prix et paiement</h2>
      <p>Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire ou autre moyen sécurisé.</p>
      
      <div class="black-highlight">
        <strong>Paiement 100% sécurisé :</strong> Vos données bancaires ne sont jamais stockées sur nos serveurs.
      </div>
      
      <hr />
      
      <h2>4. Livraison</h2>
      <p>Les services numériques sont livrés immédiatement après validation du paiement, sauf indication contraire.</p>
      
      <hr />
      
      <h2>5. Droit de rétractation</h2>
      <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement.</p>
      
      <div class="black-highlight">
        <strong>Article L221-28 :</strong> Pas de remboursement possible une fois le service numérique délivré et l'exécution commencée.
      </div>
      
      <hr />
      
      <h2>6. Contact</h2>
      <p>Pour toute question : <a href="mailto:contactcliplumia@gmail.com" class="gold-link">contactcliplumia@gmail.com</a></p>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background: linear-gradient(135deg, #2A1B3D 0%, #1E1429 100%);
    min-height: 100vh;
  }
  
  .legal-page {
    min-height: 100vh;
    padding: 4rem 1rem;
    font-family: 'Inter', sans-serif;
  }
  
  .container {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .gold-chrome {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 3rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 3rem;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.3));
  }
  
  .card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 16px;
    padding: 3rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    color: #FFD700;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.8;
    margin-bottom: 1rem;
  }
  
  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
    margin: 2rem 0;
  }
  
  .gold-link {
    color: #FFD700;
    text-decoration: none;
    transition: all 0.3s;
  }
  
  .gold-link:hover {
    color: #FFA500;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }

  /* NOUVEAU : Encadrés avec texte noir */
  .black-highlight {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #000000;
    padding: 1.2rem 1.5rem;
    border-radius: 12px;
    margin: 1.5rem 0;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  
  .black-highlight strong {
    color: #000000;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    .gold-chrome { font-size: 2rem; }
    .card { padding: 2rem 1.5rem; }
    .black-highlight { padding: 1rem; }
  }
</style>
