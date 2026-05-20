<script lang="ts">
  import { onMount } from 'svelte';
  
  let mounted = false;
  onMount(() => { mounted = true; });
</script>

<svelte:head>
  <title>ClipLumia - Générez des vidéos et images IA</title>
  <meta name="description" content="Forfait mensuel sans crédits. Propulsé par Minimax , Gemini, Luma IA et la synthèse vocale." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<main class="hero">
  <div class="hero-content">
    <div class="badge">
      💰​ Vous ne payez que ce que vous validez 🔥​ 
    </div>
    
    <h1 class="logo">ClipLumia</h1>
    
    <h2 class="subtitle">Générez des vidéos et images IA</h2>
    
    <p class="description">
      Forfait mensuel sans système de crédits 💥 <br>
      Propulsé par MidJourney, Gemini, Luma IA et la synthèse vocale 💯
    </p>



    <div class="form-box">
      <textarea 
        rows="4" 
        placeholder="Décris ta vidéo ou image... Ex: Un chat astronaute dans l'espace, style cinématique HD "
      ></textarea>
      
      <button class="bouton-generate">
        Essayer sans risque →
      </button>
    </div>
    
    <p class="note">Qualité HD • Sans engagement</p>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    /* VIOLET PROFOND + GLOW COMME TA VIDÉO */
    background: 
      radial-gradient(ellipse 100% 60% at 50% 35%, rgba(139, 92, 246, 0.6) 0%, transparent 50%),
      linear-gradient(180deg, #0A0512 0%, #1A0B2E 40%, #0A0512 100%);
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .hero-content {
    text-align: center;
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .badge {
    display: inline-block;
    background: linear-gradient(135deg, #F7E7A1 0%, #E6C76B 100%);
    color: #0A0512;
    padding: 0.6rem 1.5rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.95rem;
    box-shadow: 0 4px 20px rgba(230, 199, 107, 0.4);
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: clamp(4rem, 14vw, 9rem);
    font-weight: 900;
    margin: 0 0 2rem 0;
    /* OR BRONZE PUR - SANS JAUNE NI BLANC */
    background: linear-gradient(
      105deg, 
      #5C4A32 0%, 
      #6B5B47 15%, 
      #8B7355 30%, 
      #A0783C 45%, 
      #B8860B 60%, 
      #A0783C 75%, 
      #8B7355 90%, 
      #5C4A32 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 8s ease-in-out infinite;
    /* GLOW BRONZE + GLOW VIOLET COMME TA VIDÉO */
    filter: drop-shadow(0 0 60px rgba(139, 92, 246, 0.8))
            drop-shadow(0 0 30px rgba(168, 120, 60, 0.5));
    letter-spacing: -0.03em;
    line-height: 1;
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .subtitle {
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 700;
    color: #E6E1FF;
    margin: 0;
    line-height: 1.2;
    text-shadow: 0 2px 20px rgba(230, 225, 255, 0.3);
  }

  .description {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: #B8B3D1;
    margin: 0 0 2rem 0;
    line-height: 1.6;
    max-width: 600px;
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

  textarea::placeholder {
    color: #64748B;
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
    transition: all 0.3s ease;
    box-shadow: 0 8px 30px rgba(230, 199, 107, 0.4);
  }

  .bouton-generate:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(230, 199, 107, 0.6);

  }

  .note {
    font-size: 0.9rem;
    color: #8B87A3;
    margin: 1rem 0 0 0;
  }
</style>
