<script lang="ts">
</script>

<svelte:head>
  <title>ClipLumia - Vidéos & Images IA</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="content">
      <h1 class="logo">ClipLumia</h1>
      <p class="subtitle">"Créez des vidéos et images IA d'exception<br>sans crédits 💰 "</p>
      
      <div class="cta">
        <a href="#galerie" class="btn">Découvrir les créations</a>
      </div>
    </div>
  </section>

  <!-- Galerie -->
  <section id="galerie" class="section">
    <h2>Galerie</h2>
    <p>Nos plus belles créations IA arriveront bientôt...</p>
  </section>

  <!-- Contact -->
  <section id="contact" class="section">
    <h2>Contactez-nous</h2>
    <p>Vous avez un projet ou une question ?</p>
    <a href="mailto:contact.cliplumia@gmail.com" class="email">contact.cliplumia@gmail.com</a>
  </section>
</main>

<style>
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .hero {
    height: 100vh;
    width: 100vw;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: radial-gradient(circle at center, #3a2a5c 0%, #2a1f4a 40%, #1a0f2e 70%, #0a0419 90%);
    overflow: hidden;
  }

  .content {
    position: relative;
    z-index: 2;
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 8rem;
    font-weight: 900;
    color: #f0d090;
    text-shadow: 
      0 0 50px #f0c060,
      0 0 90px #f0c060,
      0 0 140px #ffaa00;
    margin: 0 0 1.5rem 0;
    letter-spacing: -3px;
  }

  .subtitle {
    font-size: 1.5rem;
    max-width: 720px;
    margin: 0 auto 4rem;
    color: #e0d4ff;
    line-height: 1.4;
  }

  .cta {
    margin-top: 2rem;
  }

  .btn {
    padding: 18px 45px;
    background: linear-gradient(45deg, #f0c060, #e8b040);
    color: #0a0419;
    border-radius: 50px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 10px 30px rgba(240, 192, 96, 0.3);
    transition: 0.3s;
  }

  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(240, 192, 96, 0.4);
  }

  .section {
    padding: 120px 20px;
    min-height: 60vh;
    text-align: center;
    background: #0a0419;
  }

  .email {
    color: #f0d090;
    font-size: 1.4rem;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    .logo { font-size: 5.2rem; }
    .subtitle { font-size: 1.3rem; }
  }
</style>
