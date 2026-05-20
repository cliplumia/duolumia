<script lang="ts">
</script>

<svelte:head>
  <title>ClipLumia</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <section class="hero">
    <div class="particles"></div>
    
    <div class="content">
      <h1 class="logo">
        <span class="ring"></span>
        <span class="text">ClipLumia</span>
      </h1>
      <p class="subtitle">"Créez des vidéos et images IA d'exception<br>sans crédits 💰 "</p>
    </div>
    
    <div class="scroll">↓</div>
  </section>

  <!-- TON MENU DÉROULANT COMMENCE ICI -->
  <section class="section">
    <h2>Fonctionnalités</h2>
  </section>

  <section class="section">
    <h2>Tarifs</h2>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    background: radial-gradient(ellipse at center, #2d1b4e 0%, #0a0512 100%);
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
  }

  .particles {
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(1px 1px at 25% 35%, rgba(255, 215, 0, 0.9), transparent),
      radial-gradient(1px 1px at 75% 45%, rgba(255, 215, 0, 0.7), transparent),
      radial-gradient(1px 1px at 50% 20%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1px 1px at 80% 70%, rgba(255, 215, 0, 0.8), transparent),
      radial-gradient(1px 1px at 15% 80%, rgba(255, 255, 255, 0.5), transparent),
      radial-gradient(2px 2px at 90% 15%, rgba(255, 215, 0, 0.9), transparent),
      radial-gradient(1px 1px at 40% 90%, rgba(255, 215, 0, 0.6), transparent);
    background-size: 200% 200%;
    animation: sparkle 10s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes sparkle {
    0% { background-position: 0% 0%; }
    100% { background-position: 200% 200%; }
  }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .content {
    text-align: center;
    z-index: 2;
  }

  .logo {
    position: relative;
    display: inline-block;
    margin: 0 0 2rem 0;
  }

  .text {
    position: relative;
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 12vw, 8rem);
    font-weight: 900;
    color: #E5C76B;
    text-shadow: 
      0 0 20px rgba(229, 199, 107, 0.8),
      0 0 40px rgba(229, 199, 107, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 2;
  }

  /* ANNEAU DORÉ QUI TOURNE COMME TA VIDÉO */
  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120%;
    height: 180%;
    transform: translate(-50%, -50%);
    border: 2px solid transparent;
    border-radius: 50%;
    background: 
      linear-gradient(90deg, transparent 0%, #E5C76B 25%, #FFD700 50%, #E5C76B 75%, transparent 100%) border-box;
    -webkit-mask: 
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    filter: blur(2px);
    opacity: 0.9;
    animation: rotate-ring 4s linear infinite, pulse-ring 3s ease-in-out infinite;
    z-index: 1;
  }

  .ring::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: radial-gradient(ellipse at center, 
      rgba(229, 199, 107, 0.4) 0%, 
      rgba(229, 199, 107, 0.2) 30%, 
      transparent 70%);
    filter: blur(30px);
    animation: pulse-glow 3s ease-in-out infinite;
  }

  @keyframes rotate-ring {
    0% { transform: translate(-50%, -50%) rotate(0deg) scaleX(1); }
    50% { transform: translate(-50%, -50%) rotate(180deg) scaleX(1.3); }
    100% { transform: translate(-50%, -50%) rotate(360deg) scaleX(1); }
  }

  @keyframes pulse-ring {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; transform: scale(0.9); }
    50% { opacity: 0.9; transform: scale(1.1); }
  }

  .subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
    color: #E6E1FF;
    margin: 0;
    line-height: 1.6;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .scroll {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    color: #E5C76B;
    font-size: 2rem;
    animation: bounce 2s infinite;
    z-index: 2;
    opacity: 0.8;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(15px); }
  }

  .section {
    min-height: 100vh;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    position: relative;
    z-index: 1;
  }

  .section h2 {
    font-size: 3rem;
    color: #E5C76B;
    margin-bottom: 1rem;
  }
</style>

