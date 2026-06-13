<svelte:head>
  <title>ClipLumia — Générez. Prévisualisez. Validez.</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="grid-overlay"></div>

  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">ClipLumia</a>
      <div class="nav-links">
        <a href="#outils">Outils</a>
        <a href="#forfaits">Forfaits</a>
        <a href="/studio" class="nav-cta">Studio</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <span class="hero-badge">Nouveau Studio IA</span>
      <h1 class="hero-title">
        Générez en IA.<br>
        <span class="gold-chrome">Payez uniquement<br>ce que vous validez.</span>
      </h1>
      
      <div class="hero-args">
        <div class="arg-item">
          <span class="arg-icon">✓</span>
          <div>
            <strong>Pas de crédits qui disparaissent</strong>
            <p>Vous ne payez que si vous validez la création. Rejeter = 0 crédit débité.</p>
          </div>
        </div>
        <div class="arg-item">
          <span class="arg-icon">✓</span>
          <div>
            <strong>Prévisualisation avant achat</strong>
            <p>Chaque génération arrive avec filigrane. Vous voyez avant de décider.</p>
          </div>
        </div>
        <div class="arg-item">
          <span class="arg-icon">✓</span>
          <div>
            <strong>Forfaits clairs, pas de surprises</strong>
            <p>Un nombre fixe de validations par mois. Pas de compteur caché.</p>
          </div>
        </div>
      </div>

      <div class="hero-actions">
        <a href="/studio" class="btn-primary">Tester le Studio</a>
        <a href="#forfaits" class="btn-secondary">Voir les forfaits</a>
      </div>
    </div>

    <div class="hero-media glass-premium">
      <div class="video-wrapper">
        <video src="URL_DE_TA_VIDEO_ICI" muted loop playsinline autoplay></video>
      </div>
      <div class="video-badge">Exemple généré sur ClipLumia</div>
    </div>
  </section>

  <section id="outils" class="outils">
    <h2 class="section-title">5 outils. <span class="gold-chrome">Une seule règle :</span><br>vous ne validez que ce qui vous plaît.</h2>
    
    <div class="outils-grid">
      <!-- IMAGE -->
      <div class="outil-card glass-premium">
        <div class="outil-header">
          <span class="outil-icon">🖼️</span>
          <span class="outil-tag">Images IA</span>
        </div>
        <div class="outil-demo">
          <div class="demo-box">
            <div class="demo-img"></div>
            <div class="demo-watermark">PREVIEW</div>
          </div>
          <div class="demo-actions">
            <span class="demo-btn ok">❤️ J'aime</span>
            <span class="demo-btn ko">🗑️ Rejeter</span>
          </div>
          <p class="demo-caption">1 crédit si validé · 0 si rejeté</p>
        </div>
      </div>

      <!-- VIDEO -->
      <div class="outil-card glass-premium">
        <div class="outil-header">
          <span class="outil-icon">▶️</span>
          <span class="outil-tag">Vidéos IA</span>
        </div>
        <div class="outil-demo">
          <div class="demo-box">
            <div class="demo-vid"></div>
            <div class="demo-watermark">PREVIEW</div>
          </div>
          <div class="demo-actions">
            <span class="demo-btn ok">❤️ J'aime</span>
            <span class="demo-btn ko">🗑️ Rejeter</span>
          </div>
          <p class="demo-caption">1 crédit si validé · 0 si rejeté</p>
        </div>
      </div>

      <!-- CHAT -->
      <div class="outil-card glass-premium">
        <div class="outil-header">
          <span class="outil-icon">💬</span>
          <span class="outil-tag">Chat IA</span>
        </div>
        <div class="outil-demo">
          <div class="demo-chat">
            <div class="chat-bubble user">Rédige-moi un script...</div>
            <div class="chat-bubble bot">Voici un script professionnel...</div>
          </div>
        </div>
      </div>

      <!-- VOIX -->
      <div class="outil-card glass-premium">
        <div class="outil-header">
          <span class="outil-icon">🎙️</span>
          <span class="outil-tag">Voix IA</span>
        </div>
        <div class="outil-demo">
          <div class="demo-audio">
            <div class="audio-wave">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <p>Clone et génère des voix réalistes</p>
          </div>
        </div>
      </div>

      <!-- LIPSYNC -->
      <div class="outil-card glass-premium featured">
        <div class="outil-header">
          <span class="outil-icon">🎭</span>
          <span class="outil-tag">Lipsync IA</span>
        </div>
        <div class="outil-demo">
          <div class="demo-box">
            <div class="demo-lip"></div>
            <div class="demo-watermark">PREVIEW</div>
          </div>
          <div class="demo-actions">
            <span class="demo-btn ok">❤️ J'aime</span>
            <span class="demo-btn ko">🗑️ Rejeter</span>
          </div>
          <p class="demo-caption">1 crédit si validé · 0 si rejeté</p>
        </div>
      </div>
    </div>
  </section>

  <section id="forfaits" class="forfaits">
    <h2 class="section-title">Des forfaits <span class="gold-chrome">sans surprises</span></h2>
    <p class="forfaits-sub">Chaque validation décompte 1 crédit. Les rejets sont gratuits.</p>
    
    <div class="forfaits-grid">
      <div class="forfait-card glass-premium">
        <h3>Starter</h3>
        <div class="forfait-prix"><span class="gold-chrome">9€</span><span class="mois">/mois</span></div>
        <ul>
          <li>15 vidéos/mois</li>
          <li>50 images IA/mois</li>
          <li>Chat, Voix, Lipsync inclus</li>
          <li>Payez que si vous validez</li>
        </ul>
        <a href="/signup?plan=starter" class="btn-outline">Choisir Starter</a>
      </div>

      <div class="forfait-card glass-premium">
        <h3>Standard</h3>
        <div class="forfait-prix"><span class="gold-chrome">19€</span><span class="mois">/mois</span></div>
        <ul>
          <li>40 vidéos/mois</li>
          <li>150 images IA/mois</li>
          <li>Chat, Voix, Lipsync inclus</li>
          <li>Payez que si vous validez</li>
        </ul>
        <a href="/signup?plan=standard" class="btn-outline">Choisir Standard</a>
      </div>

      <div class="forfait-card glass-premium popular">
        <div class="popular-badge">POPULAIRE</div>
        <h3>Pro</h3>
        <div class="forfait-prix"><span class="gold-chrome">39€</span><span class="mois">/mois</span></div>
        <ul>
          <li>80 vidéos/mois</li>
          <li>300 images IA/mois</li>
          <li>Chat, Voix, Lipsync inclus</li>
          <li>Support prioritaire</li>
          <li>Payez que si vous validez</li>
        </ul>
        <a href="/signup?plan=pro" class="btn-primary">Choisir Pro</a>
      </div>

      <div class="forfait-card glass-premium">
        <h3>Studio</h3>
        <div class="forfait-prix"><span class="gold-chrome">79€</span><span class="mois">/mois</span></div>
        <ul>
          <li>180 vidéos/mois</li>
          <li>800 images IA/mois</li>
          <li>Chat, Voix, Lipsync inclus</li>
          <li>Support prioritaire</li>
          <li>Payez que si vous validez</li>
        </ul>
        <a href="/signup?plan=studio" class="btn-outline">Choisir Studio</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-inner">
      <span class="footer-logo gold-chrome">ClipLumia</span>
      </div>
    </div>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background: #0c0618;
    color: #ffffff;
    overflow-x: hidden;
  }

  .gold-chrome metallique {
    background: linear-gradient(135deg, #D4AF37 0%, #FFF8DC 30%, #C5A028 60%, #FFF8DC 80%, #AA771C 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.5));
  }

  .page {
    position: relative;
    min-height: 100vh;
    background: #0c0618;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.4;
    pointer-events: none;
    z-index: 0;
  }

  .orb-1 {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.5), transparent 70%);
    top: -15%;
    left: -15%;
    animation: float 18s infinite ease-in-out;
  }

  .orb-2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%);
    bottom: 5%;
    right: -10%;
    animation: float 22s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -30px) scale(1.1); }
  }

  .grid-overlay {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 1;
  }

  .hyper glass-premium {
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
    backdrop-filter: blur(30px) saturate(160%);
    -webkit-backdrop-filter: blur(30px) saturate(160%);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    z-index: 2;
    transition: all 0.4s ease;
  }

  .glass-premium:hover {
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(12, 6, 24, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
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
    background: linear-gradient(135deg, #D4AF37, #FFF8DC, #C5A028);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .nav-links a {
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 8px 16px;
    border-radius: 100px;
    transition: all 0.3s;
  }

  .nav-links a:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }

  .nav-cta {
    background: linear-gradient(135deg, #D4AF37, #C5A028);
    color: #0c0618 !important;
    font-weight: 600;
    padding: 8px 20px !important;
  }

  .hero {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 140px 24px 80px;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .hero-badge {
    display: inline-block;
    padding: 8px 18px;
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #FFF8DC;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3.2rem;
    font-weight: 900;
    line-height: 1.15;
    margin: 0 0 32px 0;
    color: #fff;
  }

  .hero-args {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .arg-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .arg-icon {
    width: 28px;
    height: 28px;
    background: rgba(212, 175, 55, 0.2);
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D4AF37;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .arg-item div strong {
    color: #fff;
    font-size: 1rem;
    display: block;
    margin-bottom: 4px;
  }

  .arg-item div p {
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-primary {
    background: linear-gradient(135deg, #D4AF37, #C5A028);
    color: #0c0618;
    padding: 16px 32px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    border: none;
    display: inline-block;
    transition: all 0.3s;
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
    cursor: pointer;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(212, 175, 55, 0.5);
  }

  .btn-secondary {
    background: rgba(255,255,255,0.05);
    color: #fff;
    padding: 16px 32px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(255,255,255,0.15);
    display: inline-block;
    transition: all 0.3s;
  }

  .btn-secondary:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(212, 175, 55, 0.4);
  }

  .btn-outline {
    background: transparent;
    color: #D4AF37;
    padding: 14px 28px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid rgba(212, 175, 55, 0.4);
    display: inline-block;
    text-align: center;
    transition: all 0.3s;
  }

  .btn-outline:hover {
    background: rgba(212, 175, 55, 0.1);
    border-color: #D4AF37;
  }

  .hero-media {
    padding: 16px;
  }

  .video-wrapper {
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 16/9;
    background: rgba(0,0,0,0.3);
  }

  .video-wrapper video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .video-badge {
    text-align: center;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.4);
    margin-top: 12px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.4rem;
    font-weight: 700;
    text-align: center;
    margin: 0 0 16px 0;
    color: #fff;
    line-height: 1.3;
  }

  .outils {
    position: relative;
    z-index: 2;
    padding: 80px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .outils-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 24px;
    margin-top: 48px;
  }

  .outil-card {
    padding: 28px;
    text-align: center;
  }

  .outil-card.featured {
    border: 1px solid rgba(212, 175, 55, 0.35);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 25px rgba(212, 175, 55, 0.15);
  }

  .outil-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
  }

  .outil-icon {
    font-size: 1.5rem;
  }

  .outil-tag {
    font-weight: 700;
    color: #fff;
    font-size: 1.1rem;
  }

  .outil-demo {
    background: rgba(0,0,0,0.25);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.06);
  }

  .demo-box {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    height: 140px;
    margin-bottom: 12px;
    background: linear-gradient(135deg, #1a0f2e, #0f0818);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .demo-img, .demo-vid, .demo-lip {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(138, 43, 226, 0.4), transparent);
    border: 2px solid rgba(255,255,255,0.1);
  }

  .demo-vid {
    background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
  }

  .demo-lip {
    background: radial-gradient(circle, rgba(90, 54, 150, 0.5), transparent);
  }

  .demo-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-12deg);
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 2px;
    border: 1px solid rgba(255,255,255,0.5);
    padding: 4px 10px;
    background: rgba(0,0,0,0.4);
  }

  .demo-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 8px;
  }

  .demo-btn {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .demo-btn.ok {
    background: rgba(45, 138, 78, 0.2);
    border: 1px solid rgba(60, 179, 113, 0.4);
    color: #3cb371;
  }

  .demo-btn.ko {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6);
  }

  .demo-caption {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.4);
    margin: 0;
  }

  .demo-chat {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }

  .chat-bubble {
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.85rem;
    max-width: 85%;
  }

  .chat-bubble.user {
    background: rgba(90, 54, 150, 0.3);
    border: 1px solid rgba(90, 54, 150, 0.4);
    color: #fff;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  .chat-bubble.bot {
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.25);
    color: rgba(255,255,255,0.8);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }

  .demo-audio {
    text-align: center;
    padding: 20px;
  }

  .audio-wave {
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin-bottom: 12px;
  }

  .audio-wave span {
    width: 4px;
    background: linear-gradient(to top, #D4AF37, #FFF8DC);
    border-radius: 2px;
    animation: wave 1.2s infinite ease-in-out;
  }

  .audio-wave span:nth-child(1) { height: 20%; animation-delay: 0s; }
  .audio-wave span:nth-child(2) { height: 60%; animation-delay: 0.1s; }
  .audio-wave span:nth-child(3) { height: 100%; animation-delay: 0.2s; }
  .audio-wave span:nth-child(4) { height: 60%; animation-delay: 0.3s; }
  .audio-wave span:nth-child(5) { height: 20%; animation-delay: 0.4s; }

  @keyframes wave {
    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
    50% { transform: scaleY(1); opacity: 1; }
  }

  .demo-audio p {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
    margin: 0;
  }

  .forfaits {
    position: relative;
    z-index: 2;
    padding: 80px 24px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .forfaits-sub {
    text-align: center;
    color: rgba(255,255,255,0.5);
    margin: 0 0 48px 0;
    font-size: 1.05rem;
  }

  .forfaits-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .forfait-card {
    padding: 32px 24px;
    text-align: center;
    position: relative;
  }

  .forfait-card h3 {
    font-size: 1.3rem;
    color: #fff;
    margin: 0 0 12px 0;
  }

  .forfait-prix {
    font-size: 2.8rem;
    font-weight: 900;
    margin: 0 0 20px 0;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 6px;
  }

  .mois {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.5);
    font-weight: 400;
  }

  .forfait-card ul {
    list-style: none;
    padding: 0;
    margin: 0 0 24px 0;
    text-align: left;
  }

  .forfait-card ul li {
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.75);
    font-size: 0.9rem;
  }

  .forfait-card ul li:last-child {
    border-bottom: none;
  }

  .popular-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #D4AF37, #C5A028);
    color: #0c0618;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .footer {
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    padding: 48px 24px 32px;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 32px;
  }

  .footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .footer-links {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .footer-links a {
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .footer-links a:hover {
    color: #D4AF37;
  }

  .footer-bottom {
    text-align: center;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-top: 24px;
  }

  .creator {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    margin: 0 0 8px 0
    font-style: italic;
  }

  .footer-bottom p:last-child {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.3);
    margin: 0;
  }

  @media(max-width:900px){
    .hero{grid-template-columns:1fr;padding-top:120px}
    .hero h1{font-size:2.8rem}
    .steps{flex-direction:column}
    .step-arrow{transform:rotate(90deg)}
    .demos-grid{grid-template-columns:1fr}
    .pricing-grid{grid-template-columns:1fr}
    .lipsync-box{flex-direction:column}
    .lipsync-arrow{transform:rotate(90deg)}
    .footer-inner{flex-direction:column;text-align:center}
  }
</style>
