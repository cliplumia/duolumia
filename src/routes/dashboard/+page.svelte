<script>
  export let data;
  
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data.user.email);
  
  const creeLe = new Date(data.user.cree_a);
  const essaiFin = new Date(creeLe.getTime() + 24 * 60 * 60 * 1000);
  const maintenant = new Date();
  const tempsRestant = Math.max(0, essaiFin - maintenant);
  const heuresRestantes = Math.floor(tempsRestant / (1000 * 60 * 60));
  const minutesRestantes = Math.floor((tempsRestant % (1000 * 60 * 60)) / (1000 * 60));
  const essaiActif = tempsRestant > 0;
  
  function logout() {
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/';
  }
  
  async function payer(plan) {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: plan })
    });
    const result = await res.json();
    if (result.url) {
      window.location.href = result.url;
    } else {
      alert('Erreur: ' + (result.error || 'Inconnue'));
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia</h1>
    <h2>Bienvenue {data.user.nom || 'Utilisateur'} !</h2>
    
    <div class="user-info">
      <p class="email">📧 {data.user.email}</p>
      <p class="plan">Ton plan : <span class="plan-name">{data.user.plan?.toUpperCase() || 'STARTER'}</span></p>
    </div>
    
    {#if isAdmin}
      <div class="admin-badge">
        <p class="admin-title">👑 Mode Admin</p>
        <p class="admin-subtitle">Accès illimité - 0€</p>
        <p class="admin-info">Tu peux tester tout le site sans restriction</p>
      </div>
    {:else if essaiActif}
      <div class="essai">
        <p class="essai-titre">🎁 Essai gratuit actif</p>
        <p class="essai-temps">Temps restant : <strong>{heuresRestantes}h {minutesRestantes}min</strong></p>
        <p class="essai-limites">3 vidéos + 5 images IA incluses</p>
      </div>
    {:else}
      <div class="payment">
        <p class="payment-title">💳 Choisis ton forfait</p>
        <button class="btn-payer" on:click={() => payer('starter')}>Starter 9€/mois</button>
        <button class="btn-payer" on:click={() => payer('standard')}>Standard 19€/mois</button>
        <button class="btn-payer" on:click={() => payer('pro')}>Pro 39€/mois</button>
        <button class="btn-payer" on:click={() => payer('studio')}>Studio 79€/mois</button>
      </div>
    {/if}
    
    <div class="actions">
      <button class="btn-logout" on:click={logout}>← Déconnexion</button>
    </div>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d206b 50%, #2d1b4e 100%);
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }

  .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 50px 35px;
    text-align: center;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .logo {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 15px 0;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }

  h2 {
    color: #fff;
    font-size: 1.6rem;
    margin: 0 0 25px 0;
    font-weight: 400;
  }

  .user-info {
    margin: 25px 0;
  }

  .email {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 10px 0;
    word-break: break-all;
  }

  .plan {
    color: #fff;
    font-size: 1.2rem;
    margin: 20px 0 35px 0;
  }

  .plan-name {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.6));
  }

  .admin-badge {
    margin: 30px 0;
    padding: 25px;
    border: 2px solid rgba(191, 149, 63, 0.8);
    border-radius: 15px;
    background: rgba(191, 149, 63, 0.15);
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.3);
  }

  .admin-title {
    color: #fff;
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0 0 10px 0;
    text-shadow: 0 0 10px rgba(191, 149, 63, 0.8);
  }

  .admin-subtitle {
    color: #FCF6BA;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 5px 0;
  }

  .admin-info {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    margin: 10px 0 0 0;
  }

  .essai {
    margin: 30px 0;
    padding: 20px;
    border: 1px solid rgba(191, 149, 63, 0.5);
    border-radius: 15px;
    background: rgba(191, 149, 63, 0.1);
  }

  .essai-titre {
    color: #fff;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 0 10px 0;
  }

  .essai-temps {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 5px 0;
  }

  .essai-limites {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 10px 0 0 0;
  }

  .payment {
    margin: 30px 0;
    padding: 20px 0;
    border-top: 1px solid rgba(191, 149, 63, 0.3);
    border-bottom: 1px solid rgba(191, 149, 63, 0.3);
  }

  .payment-title {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .btn-payer {
    background: linear-gradient(45deg, #BF953F, #B38728);
    border: none;
    color: #fff;
    padding: 10px 15px;
    border-radius: 20px;
    margin: 5px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .btn-payer:hover {
    filter: drop-shadow(0 0 10px rgba(191, 149, 63, 0.8));
    transform: translateY(-2px);
  }

  .actions {
    margin-top: 30px;
  }

  .btn-logout {
    background: transparent;
    border: 1px solid rgba(191, 149, 63, 0.5);
    color: #fff;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-logout:hover {
    background: rgba(191, 149, 63, 0.2);
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.8));
    transform: translateY(-2px);
  }
</style>
