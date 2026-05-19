<script>

</script>
<svelte:head>
  <title>ClipLumia - Générateur Vidéo & Image IA</title>
  <meta name="description" content="Créez des vidéos IA avec MiniMax, Luma IA, Gemini. Vous ne payez que ce que vous validez.">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- Badge -->
  <div class="badge">
    💎 Vous ne payez que ce que vous validez
  </div>

  <!-- Logo OR brillant ET scintillant -->
  <h1 class="logo">
    ClipLumia
  </h1>

  <!-- Titre -->
  <h2 class="titre">
    Générez des vidéos et images IA. <br/> Si elle vous plaît pas, elle compte pas.
  </h2>

  <p class="sous-titre">
    Forfaits mensuels sans système de crédits. <br/>
    Propulsé par MiniMax, Gemini, Luma IA et la synthèse vocale.
  </p>

  <!-- Bouton -->
  <a href="/generer" class="bouton">
    Essayer sans risque →
  </a>

  <p class="trust">
    🔓 Aucun crédit perdu sur les ratés • Qualité HD
  </p>
</main>

<style>
  :global(body) {
    margin: 0;
    background: #000000;
    background-image: 
      radial-gradient(ellipse at top, #1a0b2e 0%, transparent 50%),
      radial-gradient(ellipse at bottom, #2d1b4e 0%, #000000 50%),
      linear-gradient(180deg, #000000 0%, #120821 50%, #000000 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
    color: white;
  }

  .badge {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    color: #FFD700;
    padding: 0.5rem 1.5rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 10vw, 7rem);
    font-weight: 900;
    margin: 0 0 1.5rem 0;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFED4E 75%, #FFD700 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: brillance 3s ease-in-out infinite;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
  }

  @keyframes brillance {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .titre {
    font-size: clamp(1.8rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.2;
    margin: 0 0 1rem 0;
    color: #FFFFFF;
    max-width: 900px;
  }

  .sous-titre {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: #B8B8D1;
    line-height: 1.6;
    margin: 0 0 2.5rem 0;
    max-width: 600px;
  }

  .bouton {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #000000;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 1rem 2.5rem;
    border-radius: 12px;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.4);
    border: none;
    cursor: pointer;
  }

  .bouton:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(255, 215, 0, 0.6);
  }

  .trust {
    margin-top: 1.5rem;
    color: #8B8BA7;
    font-size: 0.9rem;
  }
</style>
