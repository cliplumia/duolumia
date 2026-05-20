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
      
      <p class="subtitle">
        "Créez des vidéos et images IA d'exception<br>sans crédits 💰"
      </p>
      
      <div class="cta-buttons">
        <a href="#galerie" class="btn primary">Découvrir les créations</a>
        <a href="#contact" class="btn secondary">Essayer gratuitement</a>
      </div>
    </div>

    <div class="scroll-indicator">↓</div>
  </section>

  <!-- Autres sections à venir... -->
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0618;
    color: white;
    font-family: 'Inter', sans-serif;
  }

  .hero {
    height: 100vh;
    min-height: 650px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: radial-gradient(circle at center, #2a1b4a 0%, #0a0618 70%);
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 1;
  }

  /* Effet étoiles */
  .particles::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.15;
    animation: twinkle 8s infinite;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
  }

  .logo {
    position: relative;
    font-size: 6.5rem;
    font-weight: 900;
    font-family: 'Playfair Display', serif;
    margin: 0 0 1.5rem 0;
    color: #f8d47c;
    text-shadow: 
      0 0 20px #f8d47c,
      0 0 40px #f8d47c,
      0 0 80px #d4a017;
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 140px;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: #f8d47c;
    box-shadow: 0 0 60px #f8d47c;
    animation: orbit 12s linear infinite;
    opacity: 0.7;
  }

  .text {
    position: relative;
    z-index: 2;
  }

  .subtitle {
    font-size: 1.45rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    line-height: 1.4;
  }

  .cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: 16px 36px;
    font-size: 1.1rem;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.3s;
  }

  .primary {
    background: linear-gradient(45deg, #f8d47c, #e8b53a);
    color: #0a0618;
    font-weight: bold;
  }

  .secondary {
    border: 2px solid #f8d47c;
    color: #f8d47c;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    font-size: 2rem;
    opacity: 0.6;
    animation: bounce 2s infinite;
  }

  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.3; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(15px); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .logo { font-size: 4.5rem; }
    .ring { width: 340px; height: 100px; }
  }
</style>
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
      
      <p class="subtitle">
        "Créez des vidéos et images IA d'exception<br>sans crédits ✨"
      </p>
      
      <div class="cta-buttons">
        <a href="#galerie" class="btn primary">Découvrir les créations</a>
        <a href="#contact" class="btn secondary">Essayer gratuitement</a>
      </div>
    </div>

    <div class="scroll-indicator">↓</div>
  </section>

  <!-- Autres sections à venir... -->
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0618;
    color: white;
    font-family: 'Inter', sans-serif;
  }

  .hero {
    height: 100vh;
    min-height: 650px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: radial-gradient(circle at center, #2a1b4a 0%, #0a0618 70%);
  }

  .particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: none;
    z-index: 1;
  }

  /* Effet étoiles */
  .particles::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.15;
    animation: twinkle 8s infinite;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
  }

  .logo {
    position: relative;
    font-size: 6.5rem;
    font-weight: 900;
    font-family: 'Playfair Display', serif;
    margin: 0 0 1.5rem 0;
    color: #f8d47c;
    text-shadow: 
      0 0 20px #f8d47c,
      0 0 40px #f8d47c,
      0 0 80px #d4a017;
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 140px;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: #f8d47c;
    box-shadow: 0 0 60px #f8d47c;
    animation: orbit 12s linear infinite;
    opacity: 0.7;
  }

  .text {
    position: relative;
    z-index: 2;
  }

  .subtitle {
    font-size: 1.45rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    line-height: 1.4;
  }

  .cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: 16px 36px;
    font-size: 1.1rem;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.3s;
  }

  .primary {
    background: linear-gradient(45deg, #f8d47c, #e8b53a);
    color: #0a0618;
    font-weight: bold;
  }

  .secondary {
    border: 2px solid #f8d47c;
    color: #f8d47c;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    font-size: 2rem;
    opacity: 0.6;
    animation: bounce 2s infinite;
  }

  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.3; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(15px); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .logo { font-size: 4.5rem; }
    .ring { width: 340px; height: 100px; }
  }
</style>
