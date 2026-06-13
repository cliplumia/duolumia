<svelte:head>
  <title>ClipLumia Studio — Création visuelle par IA</title>
  <meta name="description" content="Générez des images, vidéos et animations lipsync d'exception grâce à l'intelligence artificielle.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">ClipLumia</a>
      <a href="/studio" class="nav-link">Studio</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-grid">
      <div class="hero-text">
        <h1 class="hero-title">
          Donnez vie à vos<br>
          <span class="gold-chrome">idées créatives</span>
        </h1>
        <p class="hero-desc">
          Images, vidéos et animations lipsync générées par IA 
          avec une qualité professionnelle. Décrivez, prévisualisez, 
          validez.
        </p>
        <div class="hero-actions">
          <a href="/studio" class="btn-primary">Accéder au Studio</a>
          <span class="hero-note">Sans engagement · Annulation instantanée</span>
        </div>
      </div>

      <div class="hero-media glass-3d">
        <div class="video-wrapper">
          <video 
            src="URL_DE_TA_VIDEO_ICI" 
            controls 
            muted 
            loop 
            playsinline
          ></video>
        </div>
        <p class="media-caption">Exemple généré avec ClipLumia Studio</p>
      </div>
    </div>
  </section>

  <section class="showcase">
    <h2 class="section-title">Ce que vous pouvez <span class="gold-chrome">créer</span></h2>
    
    <div class="showcase-grid">
      <article class="showcase-card glass-3d">
        <div class="card-glow"></div>
        <div class="card-icon">🖼️</div>
        <h3>Images IA</h3>
        <p>Des visuels uniques et détaillés à partir d'une simple description textuelle.</p>
      </article>

      <article class="showcase-card glass-3d featured">
        <div class="card-glow"></div>
        <div class="card-icon">▶️</div>
        <h3>Vidéos IA</h3>
        <p>Des séquences en mouvement de 5 à 6 secondes, parfaites pour les réseaux sociaux.</p>
      </article>

      <article class="showcase-card glass-3d">
        <div class="card-glow"></div>
        <div class="card-icon">🎭</div>
        <h3>Lipsync</h3>
        <p>Animez vos portraits avec une voix générée. Vos photos prennent vie.</p>
      </article>
    </div>
  </section>

  <section class="process">
    <h2 class="section-title">Une création <span class="gold-chrome">simple</span></h2>
    <div class="process-grid">
      <div class="process-step">
        <span class="step-num">01</span>
        <h4>Décrivez</h4>
        <p>Rédigez votre prompt en langage naturel. Soyez aussi précis que vous le souhaitez.</p>
      </div>
      <div class="process-arrow">→</div>
      <div class="process-step">
        <span class="step-num">02</span>
        <h4>Prévisualisez</h4>
        <p>Visualisez le résultat avec filigrane avant validation. Zéro surprise.</p>
      </div>
      <div class="process-arrow">→</div>
      <div class="process-step">
        <span class="step-num">03</span>
        <h4>Validez</h4>
        <p>Satisfait ? Un clic et la version HD sans filigrane est à vous.</p>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="cta-glass glass-3d">
      <h2>Prêt à créer ?</h2>
      <p>Rejoignez ClipLumia et produisez du contenu visuel professionnel en minutes.</p>
      <a href="/studio" class="btn-primary btn-large">Démarrer maintenant</a>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-top">
      <span class="footer-brand gold-chrome">ClipLumia</span>
      <div class="footer-links">
        <a href="/cgv">CGV</a>
        <a href="/mentions-legales">Mentions légales</a>
        <a href="/confidentialite">Confidentialité</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="creator">Créé avec passion par une créatrice</p>
      <p>© 2026 ClipLumia. Tous droits réservés.</p>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background: #05030a;
    color: #f0f0f5;
    -webkit-font-smoothing: antialiased;
  }

  .gold-chrome {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.4));
  }

  .page {
    background: 
      radial-gradient(ellipse at 20% 0%, rgba(90, 54, 150, 0.25) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(60, 30, 100, 0.2) 0%, transparent 50%),
      #05030a;
    min-height: 100vh;
  }

  .glass-3d {
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 24px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 0 0 1px rgba(191, 149, 63, 0.08);
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-3d:hover {
    transform: translateY(-6px) perspective(1000px) rotateX(2deg);
    box-shadow: 
      0 35px 70px -12px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 0 40px rgba(191, 149, 63, 0.12);
    border-color: rgba(191, 149, 63, 0.25);
  }

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(191, 149, 63, 0.08) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .glass-3d:hover .card-glow {
    opacity: 1;
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(5, 3, 10, 0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 100px;
    transition: all 0.3s ease;
  }

  .nav-link:hover {
    border-color: rgba(191, 149, 63, 0.5);
    color: #fff;
    background: rgba(191, 149, 63, 0.08);
  }

  .hero {
    padding: 140px 24px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 24px 0;
    color: #fff;
    letter-spacing: -1px;
  }

  .hero-desc {
    font-size: 1.15rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 32px 0;
    font-weight: 300;
    max-width: 480px;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #BF953F 0%, #B38728 50%, #AA771C 100%);
    color: #0a0514;
    padding: 16px 36px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(191, 149, 63, 0.3), inset 0 1px 0 rgba(255,255,255,0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(191, 149, 63, 0.5), inset 0 1px 0 rgba(255,255,255,0.4);
  }

  .btn-large {
    padding: 18px 48px;
    font-size: 1.1rem;
  }

  .hero-note {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .hero-media {
    padding: 12px;
  }

  .video-wrapper {
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
    aspect-ratio: 16/9;
  }

  .video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .media-caption {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.35);
    margin: 12px 0 0 0;
    font-style: italic;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem;
    font-weight: 700;
    text-align: center;
    margin: 0 0 48px 0;
    color: #fff;
  }

  .showcase {
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .showcase-card {
    padding: 40px 32px;
    text-align: center;
  }

  .showcase-card.featured {
    transform: scale(1.05);
    border-color: rgba(191, 149, 63, 0.2);
  }

  .showcase-card.featured:hover {
    transform: scale(1.05) translateY(-6px) perspective(1000px) rotateX(2deg);
  }

  .card-icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  .showcase-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #fff;
  }

  .showcase-card p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .process {
    padding: 80px 24px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .process-grid {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  .process-step {
    flex: 1;
    text-align: center;
    padding: 32px 24px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
  }

  .step-num {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 12px;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.6;
  }

  .process-step h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #fff;
  }

  .process-step p {
    font-size: 0.85rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
  }

  .process-arrow {
    font-size: 1.5rem;
    color: rgba(191, 149, 63, 0.4);
  }

  .cta-section {
    padding: 60px 24px 100px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .cta-glass {
    padding: 60px 40px;
  }

  .cta-glass h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin: 0 0 12px 0;
    color: #fff;
  }

  .cta-glass p {
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 32px 0;
    font-size: 1rem;
  }

  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(0, 0, 0, 0.3);
    padding: 48px 24px 32px;
  }

  .footer-top {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 32px;
  }

  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
  }

  .footer-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .footer-links a {
    color: rgba(255, 255, 255, 0.4);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #BF953F;
  }

  .footer-bottom {
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 24px;
  }

  .creator {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0 0 8px 0;
    font-style: italic;
  }

  .footer-bottom p:last-child {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.25);
    margin: 0;
  }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; gap: 40px; }
    .hero-title { font-size: 2.5rem; }
    .showcase-grid { grid-template-columns: 1fr; }
    .showcase-card.featured { transform: none; }
    .showcase-card.featured:hover { transform: translateY(-6px) perspective(1000px) rotateX(2deg); }
    .process-grid { flex-direction: column; }
    .process-arrow { transform: rotate(90deg); }
    .footer-top { flex-direction: column; text-align: center; }
  }
</style>
