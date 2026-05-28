<script>
  let loading = '';
  let error = '';

  async function goToCheckout(plan) {
    loading = plan;
    error = '';
    
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        error = data.error || 'Erreur Stripe';
        loading = '';
      }
    } catch (err) {
      error = 'Erreur de connexion';
      loading = '';
    }
  }
</script>

<svelte:head>
  <title>ClipLumia - Choisis ton plan</title>
</svelte:head>

<div class="bg">
  <div class="container">
    <h1>Choisis ton plan ClipLumia</h1>
    <p class="subtitle">Paiement sécurisé par Stripe • Mode TEST • Annule à tout moment</p>
    
    {#if error}
      <div class="error">⚠️ {error}</div>
    {/if}
    
    <div class="plans">
      <!-- STANDARD 19€ -->
      <div class="plan">
        <div class="plan-name">Standard</div>
        <div class="plan-price">19€<span>/mois</span></div>
        <ul class="plan-features">
          <li>10 vidéos / mois</li>
          <li>Export HD 1080p</li>
          <li>Support email</li>
          <li>Templates de base</li>
        </ul>
        <button 
          class="btn-select" 
          on:click={() => goToCheckout('standard')}
          disabled={loading === 'standard'}
        >
          {loading === 'standard'? 'Redirection...' : 'Choisir Standard'}
        </button>
      </div>
      
      <!-- PRO 39€ -->
      <div class="plan recommended">
        <div class="badge">POPULAIRE</div>
        <div class="plan-name">Pro</div>
        <div class="plan-price">39€<span>/mois</span></div>
        <ul class="plan-features">
          <li>30 vidéos / mois</li>
          <li>Export 4K</li>
          <li>Support prioritaire</li>
          <li>Tous les templates</li>
          <li>Sans watermark</li>
        </ul>
        <button 
          class="btn-select" 
          on:click={() => goToCheckout('pro')}
          disabled={loading === 'pro'}
        >
          {loading === 'pro'? 'Redirection...' : 'Choisir Pro'}
        </button>
      </div>
      
      <!-- STUDIO 79€ -->
      <div class="plan">
        <div class="plan-name">STUDIO</div>
        <div class="plan-price">79€<span>/mois</span></div>
        <ul class="plan-features">
          <li>Vidéos illimitées</li>
          <li>Export 4K + RAW</li>
          <li>Support VIP 24/7</li>
          <li>Templates exclusifs</li>
          <li>API Access</li>
        </ul>
        <button 
          class="btn-select" 
          on:click={() => goToCheckout('studio')}
          disabled={loading === 'studio'}
        >
          {loading === 'studio'? 'Redirection...' : 'Choisir STUDIO'}
        </button>
      </div>
    </div>
    
    <p class="secure">🔒 Paiement 100% sécurisé par Stripe • Mode TEST activé</p>
  </div>
</div>

<style>
  /* COULEURS : Violet Satiné + Gold Chrome */
 .bg {
    background: #1A0B2E; /* Violet Satiné - Très foncé */
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Inter', sans-serif;
  }
  
 .container { max-width: 1100px; width: 100%; }
  
  h1 {
    color: #fff;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
  }
  
 .subtitle {
    color: #C9A86A; /* Gold Chrome */
    text-align: center;
    margin-bottom: 40px;
    font-size: 1.1rem;
  }
  
 .error {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: #ff6b6b;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    margin-bottom: 30px;
  }
  
 .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
  }
  
 .plan {
    background: rgba(255, 255, 255, 0.05); /* Verre dépoli */
    backdrop-filter: blur(10px);
    border: 1px solid rgba(201, 168, 106, 0.3); /* Bordure Gold */
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
  }
  
 .plan:hover {
    transform: translateY(-5px);
    border-color: #C9A86A;
    box-shadow: 0 20px 40px rgba(201, 168, 106, 0.2);
  }
  
 .plan.recommended { border: 2px solid #C9A86A; }
  
 .badge {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    background: #C9A86A; /* Gold Chrome */
    color: #1A0B2E; /* Texte Violet foncé */
    padding: 5px 20px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  
 .plan-name {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 15px;
  }
  
 .plan-price {
    color: #C9A86A; /* Gold Chrome */
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 5px;
  }
  
 .plan-price span {
    font-size: 1rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
  }
  
 .plan-features {
    list-style: none;
    margin: 30px 0;
    text-align: left;
    padding: 0;
  }
  
 .plan-features li {
    color: rgba(255, 255, 255, 0.9);
    padding: 8px 0;
    padding-left: 25px;
    position: relative;
  }
  
 .plan-features li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #C9A86A; /* Check Gold */
    font-weight: bold;
  }
  
 .btn-select {
    background: linear-gradient(135deg, #C9A86A 0%, #B69852 100%); /* Dégradé Gold */
    color: #1A0B2E; /* Texte Violet foncé */
    border: none;
    padding: 15px 40px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;
  }
  
 .btn-select:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(201, 168, 106, 0.4);
  }
  
 .btn-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
 .secure {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    margin-top: 20px;
    }
 </style>
