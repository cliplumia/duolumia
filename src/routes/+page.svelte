<script lang="ts">
</script>

<svelte:head>
  <title>ClipLumia - Vidéos & Images IA</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400&display=swap" rel="stylesheet">
</svelte:head>

<main>
  <!-- HERO -->
  <section class="hero">
    <div class="particles"></div>
    
    <div class="content">
      <h1 class="logo">
        <span class="ring"></span>
        <span class="text">ClipLumia</span>
      </h1>
      
      <p class="subtitle">
        "Créez des vidéos et images IA d'exception<br>sans crédits💰 "
      </p>
      
      <div class="cta-buttons">
        <a href="#galerie" class="btn primary">Découvrir les créations</a>
        <a href="#contact" class="btn secondary">Essayer gratuitement</a>
      </div>
    </div>

    <div class="scroll-indicator">↓</div>
  </section>

  <!-- Galerie -->
  <section id="galerie" class="section">
    <h2>Galerie</h2>
    <p>Nos plus belles créations IA arriveront bientôt...</p>
  </section>

  <!-- Contact -->
  <section id="contact" class="section">
    <h2>Contactez-nous</h2>
    <p>Vous avez un projet ou des questions ?</p>
    
    <div class="contact-info">
      <p><strong>Email :</strong> <a href="mailto:contact.cliplumia@gmail.com">contact.cliplumia@gmail.com</a></p>
    </div>
  </section>
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
    inset: 0;
    pointer-events: none;
  }

  .particles::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle, #fff 1px, transparent 1px),
      radial-gradient(circle, #fff 1px, transparent 1px);
    background-position: 0 0, 40px 60px;
    background-size: 80px 80px;
    opacity: 0.25;
    animation: twinkle 8s infinite alternate;
  }

  .particles::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #f8d47c 1.5px, transparent 1.5px);
    background-size: 120px 120px;
    opacity: 0.15;
    animation: drift 35s linear infinite;
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
    font-size: 7rem;
    font-weight: 900;
    font-family: 'Playfair Display', serif;
    margin: 0 0 1.5rem 0;
    color: #f8d47c;
    text-shadow: 0 0 30px #f8d47c, 0 0 60px #f8d47c, 0 0 100px #d4a017;
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 560px;
    height: 160px;
    border: 4px solid transparent;
    border-top-color: #f8d47c;
    border-radius: 50%;
    box-shadow: 0 0 80px #f8d47c;
    animation: orbit 18s linear infinite;
    opacity: 0.75;
  }

  .subtitle { 
    font-size: 1.5rem; 
    margin-bottom: 3rem; 
    line-height: 1.4; 
  }

  .cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    padding: 16px 40px;
    font-size: 1.15rem;
    border-radius: 50px;
    text-decoration: none;
    transition: 0.3s;
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
    bottom: 50px;
    font-size: 2.2rem;
    animation: bounce 2s infinite;
  }

  .section {
    padding: 120px 20px;
    text-align: center;
  }

  .contact-info {
    margin-top: 30px;
    font-size: 1.3rem;
  }

  .contact-info a {
    color: #f8d47c;
  }

  /* Animations */
  @keyframes orbit {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes twinkle {
    0% { opacity: 0.2; }
    100% { opacity: 0.4; }
  }

  @keyframes drift {
    from { background-position: 0 0; }
    to { background-position: 200px 150px; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(20px); }
  }

  @media (max-width: 768px) {
    .logo { font-size: 4.8rem; }
    .ring { width: 360px; height: 110px; }
  }
</style>
