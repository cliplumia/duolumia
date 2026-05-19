<script>
  let prompt = "";
</script>

<svelte:head>
  <title>ClipLumia - Générateur Vidéo & Image IA</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<section class="hero">
  <div class="badge">
    💎 Vous ne payez que ce que vous validez 💰
  </div>

  <h1 class="logo">
    ClipLumia
  </h1>

  <h2 class="titre">
    Générez des vidéos et images IA
  </h2>

  <p class="sous-titre">
    Forfaits mensuels sans système de crédits.<br/>
    Propulsé par MiniMax, Gemini, Luma IA et la synthèse vocale.
  </p>

  <a href="#generateur" class="bouton">
    Essayer sans risque ↓
  </a>

  <p class="trust">
    🔓 Qualité HD • Sans engagement
  </p>
</section>

<section id="generateur" class="generateur">
  <h3>Décrivez votre idée</h3>
  <div class="form-box">
    <textarea bind:value={prompt} placeholder="Un astronaute qui danse sur la lune..." rows="4"></textarea>
    <button class="bouton-generate">Générer la vidéo →</button>
  </div>
</section>

<style>
  :global(body) {
    margin: 0;
    /* VIOLET SOIE FORCÉ - 12 BANDES VISIBLES */
    background: 
      repeating-linear-gradient(
        180deg,
        #0D0518 0px,
        #0D0518 40px,
        #1A0B2E 40px,
        #1A0B2E 80px,
        #2D1B4E 80px,
        #2D1B4E 120px,
        #3D2B5E 120px,
        #3D2B5E 160px,
        #2D1B4E 160px,
        #2D1B4E 200px,
        #1A0B2E 200px,
        #1A0B2E 240px,
        #0D0518 240px,
        #0D0518 280px
      );
    background-size: 100% 280px;
    animation: silk-wave 6s ease-in-out infinite;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* ANIMATION VISIBLE DES VAGUES */
  @keyframes silk-wave {
    0%, 100% { background-position: 0% 0%; }
    50% { background-position: 0% 140px; }
  }

  /* GRAIN TISSU POUR EFFET SOIE */
  :global(body::before) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  /* HALO CENTRAL VIOLET */
  :global(body::after) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse 100% 60% at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
    color: white;
    position: relative;
    z-index: 1;
  }

  .badge {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 0.65rem 1.9rem;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 3.5rem;
    backdrop-filter: blur(20px);
    background: linear-gradient(105deg, #8B7355 0%, #F7E7A1 20%, #FFFFFF 35%, #F7E7A1 50%, #FFFFFF 65%, #E6C76B 80%, #8B7355 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s ease-in-out infinite;
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: clamp(4rem, 14vw, 9rem);
    font-weight: 900;
    margin: 0 0 2rem 0;
    /* OR BLANC PUR - 0 JAUNE */
    background: linear-gradient(
      105deg, 
      #6B5B47 0%,
      #C9A961 8%,
      #F7E7A1 16%,
      #FFFFFF 24%,
      #F7E7A1 32%,
      #E6C76B 40%,
      #FFFFFF 48%,
      #E6C76B 56%,
      #F7E7A1 64%,
      #FFFFFF 72%,
      #C9A961 80%,
      #6B5B47 100%
    );
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 2.5s ease-in-out infinite;
    filter: drop-shadow(0 0 80px rgba(255, 255, 255, 1)) 
            drop-shadow(0 0 160px rgba(247, 231, 161, 0.9))
            drop-shadow(0 4px 50px rgba(230, 199, 107, 1));
    letter-spacing: -0.03em;
    line-height: 1;
  }

  @keyframes shimmer {
    0% { background-position: -300% center; }
    100% { background-position: 300% center; }
  }

  .titre {
    font-size: clamp(1.3rem, 3.5vw, 2.2rem);
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 1.5rem 0;
    color: #F1F5F9;
    max-width: 700px;
  }

  .sous-titre {
    font-size: clamp(0.95rem, 1.8vw, 1.05rem);
    color: #CBD5E1;
    line-height: 1.7;
    margin: 0 0 3rem 0;
    max-width: 550px;
  }

  .bouton {
    background: linear-gradient(135deg, #F7E7A1 0%, #E6C76B 100%);
    color: #0A0512;
    font-weight: 700;
    font-size: 1rem;
    padding: 1.1rem 2.8rem;
    border-radius: 16px;
    text-decoration: none;
    display: inline-block;
    transition: all 0.4s ease;
    box-shadow: 0 10px 40px rgba(230, 199, 107, 0.5);
    border: none;
    cursor: pointer;
  }

  .bouton:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 60px rgba(230, 199, 107, 0.7);
  }

  .trust {
    margin-top: 2.2rem;
    color: #94A3B8;
    font-size: 0.8rem;
  }

  .generateur {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(40px);
  }

  .generateur h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #F1F5F9;
  }

  .form-box {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    max-width: 700px;
    width: 100%;
    backdrop-filter: blur(20px);
  }

  textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 1.5rem;
  }

  .bouton-generate {
    width: 100%;
    background: linear-gradient(135deg, #F7E7A1 0%, #E6C76B 100%);
    color: #0A0512;
    font-weight: 700;
    font-size: 1.1rem;
    padding: 1.2rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
  }
</style>
