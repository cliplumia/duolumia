<div class="hero">
  <video autoplay muted loop playsinline class="hero-video">
    <source src="/video/hero.mp4" type="video/mp4" />
  </video>
  
  <div class="overlay">
    <div class="bienvenue">Bienvenue</div>
    <h1 class="title">ClipLumia</h1>
    <p class="subtitle">"Créez des vidéos et images IA d'exception sans crédits"</p>
    <a href="/app" class="btn">Visiter le site</a>
  </div>
</div>

<style>
  .hero {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }
  
  .hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: 1;
  }
  
  .overlay {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    padding: 2rem;
  }
  
  .bienvenue {
    position: absolute;
    top: 2rem;
    right: 2rem;
    font-size: 1.5rem;
    color: #4fc3f7;
  }
  
  .title {
    font-size: 5rem;
    font-weight: 300;
    margin: 0;
    color: #ffd700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  
  .subtitle {
    font-size: 1.2rem;
    margin: 1rem 0 2rem 0;
    opacity: 0.9;
  }
  
  .btn {
    display: inline-block;
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #d4af37, #f9d423);
    color: #000;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
  }
  
  .btn:hover {
    transform: scale(1.05);
  }
</style>
