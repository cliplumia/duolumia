<script lang="ts">
</script>

<svelte:head>
  <title>ClipLumia</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <section class="hero">
    <div class="background"></div>
    <div class="particles"></div>
    
    <div class="content">
      <h1 class="logo">
        <span class="ring"></span>
        <span class="text">ClipLumia</span>
      </h1>
      <p class="subtitle">"Créez des vidéos et images IA d'exception<br>sans crédits ✨"</p>
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .hero {
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0c051f;
    overflow: hidden;
  }

  .background {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, #3a1f5c 0%, #0c051f 60%);
  }

  .particles {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle, rgba(255,255,255,0.9) 0.8px, transparent 1px),
      radial-gradient(circle, rgba(255,215,0,0.6) 1px, transparent 1px);
    background-size: 90px 90px, 140px 140px;
    opacity: 0.35;
    animation: stars 25s linear infinite;
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .logo {
    position: relative;
    font-family: 'Playfair Display', serif;
    font-size: 9rem;
    font-weight: 900;
    color: #f8e8b0;
    text-shadow: 
      0 0 40px #f8d47c,
      0 0 80px #f8d47c,
      0 0 120px #ffaa00,
      0 0 160px #ff8800;
    margin: 0;
    letter-spacing: -2px;
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 680px;
    height: 190px;
    border: 6px solid transparent;
    border-top-color: #ffd700;
    border-radius: 50%;
    box-shadow: 0 0 90px #ffd700, 0 0 140px #ffaa00;
    animation: orbit 10s linear infinite;
    opacity: 0.9;
  }

  .subtitle {
    font-size: 1.45rem;
    margin-top: 2rem;
    color: #e0d0ff;
    text-shadow: 0 0 20px rgba(255,255,255,0.3);
  }

  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes stars {
    from { background-position: 0 0, 0 0; }
    to { background-position: 200px 300px, -150px -200px; }
  }

  @media (max-width: 768px) {
    .logo { font-size: 5.5rem; }
    .ring { width: 420px; height: 120px; }
  }
</style>
