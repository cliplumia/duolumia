<script lang="ts">
</script>

<svelte:head>
  <title>ClipLumia - IA Vidéo & Image</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="particles"></div>
    <div class="content">
      <h1 class="logo">ClipLumia</h1>
      <p class="subtitle">"Créez des vidéos et images IA d'exception<br>sans crédits 💰 "</p>
      
      <div class="cta">
        <a href="#galerie" class="btn">Découvrir les créations</a>
      </div>
    </div>
    <div class="scroll-down">↓ Scroll</div>
  </section>

  <!-- Galerie -->
  <section id="galerie" class="section">
    <h2>Galerie</h2>
    <p>Nos créations IA arriveront ici bientôt...</p>
  </section>

  <!-- Contact -->
  <section id="contact" class="section">
    <h2>Contact</h2>
    <p>Vous avez un projet ?</p>
    <a href="mailto:contact.cliplumia@gmail.com" class="email">contact.cliplumia@gmail.com</a>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #0a0419;
    color: white;
    font-family: 'Inter', sans-serif;
  }

  .hero {
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: radial-gradient(circle at center, #2a1b4a 0%, #0a0419 70%);
    overflow: hidden;
  }

  .particles {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 2px);
    background-size: 80px 80px;
    opacity: 0.3;
    animation: drift 40s linear infinite;
  }

 .logo {
    font-family: 'Playfair Display', serif;
    font-size: 8rem;
    font-weight: 900;
    color: #f0d090;
    text-shadow: 
      0 0 40px #f0c060,
      0 0 80px #f0c060,
      0 0 120px #ffaa00,
      0 0 160px #ff8800;
    margin: 0 0 1.5rem 0;
    letter-spacing: -2px;
}

  .subtitle {
    font-size: 1.5rem;
    max-width: 700px;
    margin: 0 auto 2rem;
  }

  .cta .btn {
    padding: 15px 40px;
    background: #f0c060;
    color: #0a0419;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .scroll-down {
    position: absolute;
    bottom: 40px;
    font-size: 1.8rem;
    animation: bounce 2s infinite;
  }

  .section {
    padding: 120px 20px;
    min-height: 60vh;
    text-align: center;
  }

  .email {
    color: #f0d090;
    font-size: 1.4rem;
  }

  @keyframes drift {
    from { background-position: 0 0; }
    to { background-position: 300px 200px; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(15px); }
  }

  @media (max-width: 768px) {
    .logo { font-size: 4.8rem; }
  }
</style>
