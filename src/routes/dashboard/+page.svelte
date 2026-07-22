<script>
  export let data;

  const PLANS = [
    { id: 'starter', label: 'Starter', price: '9€' },
    { id: 'standard', label: 'Standard', price: '19€' },
    { id: 'pro', label: 'Pro', price: '39€' },
    { id: 'studio', label: 'Studio', price: '79€' }
  ];

  let upgrading = '';
  let upgradeError = '';
  let managingSubscription = false;
  let manageError = '';

  const forfaitsPayants = ['starter', 'standard', 'pro', 'studio'];

  function logout() {
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/';
  }

  async function upgrade(plan) {
    upgradeError = '';
    upgrading = plan;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        upgradeError = data.error || 'Erreur inconnue';
        upgrading = '';
      }
    } catch (e) {
      upgradeError = e.message;
      upgrading = '';
    }
  }

  async function manageSubscription() {
    manageError = '';
    managingSubscription = true;
    try {
      const res = await fetch('/api/customer-portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        manageError = data.error || 'Erreur inconnue';
        managingSubscription = false;
      }
    } catch (e) {
      manageError = e.message;
      managingSubscription = false;
    }
  }
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia</h1>
    <h2>Bienvenue {data.user.nom || ''} !</h2>
    <p class="email">📧 {data.user.email}</p>
    <p class="plan">Plan : {data.user.plan?.toUpperCase() || 'STARTER'}</p>

    <!-- BOUTON STUDIO -->
    <a href="/studio" class="btn-studio">🎨 Générer mes contenus IA</a>

    <div class="upgrade-section">
      <p class="upgrade-title">Changer de forfait</p>
      <div class="upgrade-grid">
        {#each PLANS as p}
          <button
            type="button"
            class="btn-plan"
            class:current={data.user.plan === p.id}
            disabled={upgrading !== '' || data.user.plan === p.id}
            on:click={() => upgrade(p.id)}
          >
            {data.user.plan === p.id ? '✓ ' : ''}{p.label} — {p.price}{upgrading === p.id ? '…' : ''}
          </button>
        {/each}
      </div>
      {#if upgradeError}
        <p class="upgrade-error">{upgradeError}</p>
      {/if}
    </div>

    {#if forfaitsPayants.includes(data.user.plan)}
      <button class="btn-manage" on:click={manageSubscription} disabled={managingSubscription}>
        {managingSubscription ? 'Redirection…' : '⚙️ Gérer / Annuler mon abonnement'}
      </button>
      {#if manageError}
        <p class="upgrade-error">{manageError}</p>
      {/if}
    {/if}

    <button class="btn-logout" on:click={logout}>← Déconnexion</button>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d206b 50%, #2d1b4e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }
  .card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(191,149,63,0.5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 50px 35px;
    text-align: center;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .logo {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 15px 0;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  h2 { color: #fff; font-size: 1.6rem; margin: 0 0 10px 0; }
  .email { color: rgba(255,255,255,0.9); font-size: 1rem; margin: 5px 0; word-break: break-all; }
  .plan { color: #fff; font-size: 1.2rem; margin: 10px 0 30px 0; font-weight: bold; }
  
  .btn-studio {
    display: block;
    background: linear-gradient(45deg, #BF953F, #B38728);
    color: #fff;
    padding: 15px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }
  .btn-studio:hover {
    filter: drop-shadow(0 0 15px rgba(191,149,63,0.8));
    transform: translateY(-2px);
  }
  
  .upgrade-section {
    margin-bottom: 20px;
  }
  .upgrade-title {
    color: rgba(255,255,255,0.9);
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
  .upgrade-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .btn-plan {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(191,149,63,0.4);
    color: #fff;
    padding: 10px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-plan:hover:not(:disabled) {
    background: rgba(191,149,63,0.2);
  }
  .btn-plan:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .btn-plan.current {
    border-color: #3cb371;
    color: #3cb371;
  }
  .upgrade-error {
    color: #ff6b6b;
    font-size: 0.85rem;
    margin: 10px 0 0 0;
  }
  .btn-manage {
    display: block;
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(191,149,63,0.4);
    color: #FCF6BA;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.3s ease;
  }
  .btn-manage:hover:not(:disabled) {
    background: rgba(191,149,63,0.15);
  }
  .btn-manage:disabled {
    opacity: 0.6;
    cursor: default;
  }
  .btn-logout {
    background: transparent;
    border: 1px solid rgba(191,149,63,0.5);
    color: #fff;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-logout:hover {
    background: rgba(191,149,63,0.2);
  }
</style>
