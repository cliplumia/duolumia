<script>
  export let data;
  
  function logout() {
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/';
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
    
    <div class="actions">
      <button class="btn-logout" on:click={logout}>← Déconnexion</button>
    </div>
  </div>
</div>

<style>
  /* === FOND VIOLET SATINÉ === */
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

  /* === CARTE VITRÉE === */
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

  /* === GOLD CHROME - 45DEG 5 COULEURS === */
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

