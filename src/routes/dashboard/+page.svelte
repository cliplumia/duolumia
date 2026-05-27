<script>
  import { onMount } from 'svelte';
  
  // Plus tard on récupèrera le vrai nom du user ici
  let userName = 'DEV';
  let userPlan = 'STUDIO'; // Temporaire
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia</h1>
    <h2>Bienvenue {userName} !</h2>
    <p class="plan">Ton plan actuel : <span class="plan-name">{userPlan}</span></p>
    
    <div class="content">
      <p>Ton dashboard arrive très bientôt 🚀</p>
      <p class="secure">🔒 Espace 100% sécurisé</p>
    </div>

    <a href="/" class="back">← Retour à l'accueil</a>
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

  .plan {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 35px;
  }

  .plan-name {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.6));
  }

  .content {
    margin: 25px 0;
  }

  .content p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    margin: 15px 0;
  }

  .secure {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    margin: 25px 0 15px 0;
  }

  .back {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
  }

  .back:hover {
    filter: drop-shadow(0 0 10px rgba(191, 149, 63, 0.8));
  }
</style>
