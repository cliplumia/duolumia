<script lang="ts">
  import { onMount } from 'svelte';
  
  let mounted = false;
  onMount(() => { mounted = true; });
</script>

<svelte:head>
  <title>ClipLumia - Créez des vidéos IA et images d'exception 🔥 </title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="hero">
  <div class="stars"></div>
  
  
  <div class="content">
    <h1 class="logo">
      <span class="halo"></span>
      ClipLumia
    </h1>
    
    <p class="subtitle">
      "Créez des vidéos et images IA d'exception<br>sans crédits 💰​ "
    </p>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    background: radial-gradient(ellipse at center, #1a0b2e 0%, #0a0512 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .stars {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20% 30%, rgba(255, 215, 0, 0.8), transparent),
      radial-gradient(2px 2px at 60% 70%, rgba(255, 215, 0, 0.6), transparent),
      radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1px 1px at 80% 10%, rgba(255, 215, 0, 0.7), transparent),
      radial-gradient(2px 2px at 90% 60%, rgba(255, 255, 255, 0.6), transparent),
      radial-gradient(1px 1px at 33% 80%, rgba(255, 215, 0, 0.8), transparent),
      radial-gradient(1px 1px at 15% 60%, rgba(255, 255, 255, 0.7), transparent);
    background-size: 200% 200%;
    background-position: 0% 0%;
    animation: twinkle 8s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes twinkle {
    0% { opacity: 0.5; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.05); }
  }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    padding: 2rem;
  }

  .bienvenue {
    position: absolute;
    top: 2rem;
    right: 2rem;
    color: #4DD0E1;
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: 0 0 20px rgba(77, 208, 225, 0.6);
  }

  .content {
    text-align: center;
    z-index: 2;
  }

  .logo {
    position: relative;
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 12vw, 8rem);
    font-weight: 900;
    margin: 0 0 2rem 0;
    color: #D4AF37;
    text-shadow: 
      0 0 40px rgba(212, 175, 55, 0.9),
      0 0 80px rgba(212, 175, 55, 0.6),
      0 0 120px rgba(212, 175, 55, 0.4);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .halo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 120%;
    background: radial-gradient(ellipse 40% 100%, 
      rgba(212, 175, 55, 0.6) 0%, 
      rgba(212, 175, 55, 0.4) 20%, 
      rgba(212, 175, 55, 0.2) 40%, 
      rgba(212, 175, 55, 0.1) 60%, 
      transparent 80%);
    filter: blur(50px);
    animation: stretch 3.5s ease-in-out infinite;
    z-index: -1;
  }

  @keyframes stretch {
    0%, 100% { 
      opacity: 0.4;
      width: 100%;
      transform: translate(-50%, -50%);
    }
    50% { 
      opacity: 0.8;
      width: 180%;
      transform: translate(-50%, -50%);
    }
  }

  .subtitle {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    color: #E6E1FF;
    margin: 0;
    line-height: 1.6;
    font-weight: 400;
    text-shadow: 0 2px 20px rgba(230, 225, 255, 0.3);
  }
</style>


  
