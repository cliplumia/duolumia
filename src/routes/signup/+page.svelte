<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let plan = $page.url.searchParams.get('plan') || 'starter';
  
  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          console.log('Plan:', plan);
          console.log('Token Google:', response.credential);
          alert('Connexion réussie ! Plan: ' + plan.toUpperCase());
        }
      });
      
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { 
          theme: "outline", 
          size: "large", 
          text: "continue_with",
          shape: "pill",
          width: "320"
        } 
      );
    };
  });
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia</h1>
    <h2>Finalise ton inscription</h2>
    <p class="plan">Plan sélectionné : <span class="plan-name">{plan.toUpperCase()}</span></p>
    
    <div id="googleBtn"></div>
    
    <p class="secure">🔒 Connexion 100% sécurisée avec Google</p>
    <a href="/" class="back">← Retour aux forfaits</a>
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
  
  #googleBtn {
    display: flex;
    justify-content: center;
    margin: 25px 0;
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
