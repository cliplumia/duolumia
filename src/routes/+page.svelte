<script>  
  let demoLiked = $state({img: false, vid: false, lip: false});
  let chatInput = $state('');
  let chatMsgs = $state([{who:'bot', text:'Bonjour ! Décrivez votre vision...'}]);
  
  function sendChat() {
    if(!chatInput

</script>

<svelte:head>
  <title>ClipLumia - Forfait simple.</title>
  <meta name="description" content="ClipLumia - Forfait simple. STOP LES VIDÉOS RATÉES : Tu génères avec filigrane avant validation. Tu kiffes ? Tu valides = 1 sur forfait. Tu kiffes pas ? Rejeter = 0 sur forfait. Sans engagement. Annule en 2 clics.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <nav class="nav">
    <a href="/" class="logo">ClipLumia</a>
    <a href="/studio" class="nav-link">Studio</a>
  </nav>

  <!-- SECTION HERO -->
  <section class="hero">
    <!-- Texte -->
    <div class="hero-text">
      <span class="badge">Studio IA Professionnel</span>
      <h1>
        Créez sans risque.<br>
        <span class="gold-chrome">Aucun gaspillage.</span>
      </h1>
      <div class="hero-concept">
        <div class="concept-line">
          ✓ <strong>STOP LES CRÉDITS 👆</strong><br>
          80 vidéos/mois. Pas de compteur qui stresse.
        </div>
        <div class="concept-line">
          ✓ <strong>STOP LES VIDÉOS RATÉES</strong><br>
          Tu génères avec filigrane.<br>
          Tu aimes ? Validation.<br>
          Tu n'aimes pas ? <strong>0€ décompté.</strong>
        </div>
      </div>
      <a href="/studio" class="btn-primary">Tester gratuitement</a>
      <span class="note">Sans engagement · Annulez en 2 clics</span>
    </div>
    <!-- Vidéo -->
    <div class="hero-media glass">
      <video src="https://pub-6476d128f599432f96789b76ebbca25a.r2.dev/videocliplumia.%201.mp4"
             controls muted loop playsinline preload="metadata"
             style="width:100%;height:auto;object-fit:cover;display:block;">
      </video>
      <p class="caption">Exemple généré avec ClipLumia</p>
    </div>
  </section>

  <!-- SECTION CONCEPT -->
  <section class="concept">
    <h2 class="section-title">Zéro gaspillage. <span class="gold-chrome">100% contrôle.</span></h2>
    <div class="steps">
      <div class="step glass"><span>1</span><h4>Générez</h4><p>Aperçu avec filigrane en quelques secondes.</p></div>
      <div class="arrow">→</div>
      <div class="step glass"><span>2</span><h4>Validez</h4><p>❤️ = 1 forfait. 🗑️ = 0 forfait.</p></div>
      <div class="arrow">→</div>
      <div class="step glass"><span>3</span><h4>Téléchargez</h4><p>Version HD sans filigrane immédiatement.</p></div>
    </div>
  </section>

  <!-- SECTION DEMOS -->
  <section class="demos">
    <h2 class="section-title">5 outils. <span class="gold-chrome">1 studio.</span></h2>
    <div class="demos-grid">
      <!-- Images IA -->
      <div class="demo-card glass">
        <div class="demo-top"><span>🖼️ Images IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <img src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=400&fit=crop&auto=format"
               alt="Exemple d'image générée par IA"
               loading="lazy"
               style="width:100%;height:160px;object-fit:cover;display:block;">
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('img')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.img=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">50 à 800 images/mois selon votre forfait.</p>
      </div>
      <!-- Vidéos IA -->
      <div class="demo-card glass">
        <div class="demo-top"><span>▶️ Vidéos IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <video src="https://pub-6476d128f599432f96789b76ebbca25a.r2.dev/videocliplumia.%201.mp4"
                 muted loop playsinline preload="metadata" loading="lazy"
                 style="width:100%;height:160px;object-fit:cover;display:block;">
          </video>
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('vid')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.vid=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">15 à 180 vidéos/mois. Durée 5-6 secondes.</p>
      </div>
      <!-- Chat IA -->
      <div class="demo-card glass">
        <div class="demo-top"><span>💬 Chat IA</span></div>
        <div class="chat-box">
          <!-- Messages -->
          {#each chatMsgs as m}
            <div class="msg" class:user={m.who==='user'}>
              <span>{m.who==='user'?'🧑':'🤖'}</span>
              <div class="bubble">{m.text}</div>
            </div>
          {/each}
        </div>
        <div class="chat-input">
          <input type="text" bind:value={chatInput} on:keypress={(e)=>e.key==='Enter'&&sendChat()} placeholder="Décrivez votre idée..." />
          <button type="button" on:click={sendChat}>Envoyer</button>
        </div>
        <p class="demo-desc">Assistant créatif intégré.</p>
      </div>
      <!-- Voix IA -->
      <div class="demo-card glass">
        <div class="demo-top"><span>🎙️ Voix IA</span></div>
        <div class="voice-box">
          <div class="wave">
            <div class="bar" style="height:40%"></div><div class="bar" style="height:70%"></div>
            <div class="bar" style="height:50%"></div><div class="bar" style="height:90%"></div>
            <div class="bar" style="height:60%"></div><div class="bar" style="height:80%"></div>
          </div>
          <button class="btn-play" on:click={playVoiceDemo}>▶ Écouter la voix française</button>
        </div>
        <p class="demo-desc">Voix IA : "Bonjour, bienvenue sur mon site ClipLumia"</p>
      </div>
      <!-- Lipsync IA -->
      <div class="demo-card glass wide">
        <div class="demo-top"><span>🎭 Lipsync IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <div class="img-placeholder video">
            <div class="placeholder-shimmer"></div>
            <span class="ph-icon">🎭</span>
            <span class="ph-label">Votre lipsync IA</span>
          </div>
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('lip')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.lip=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">Photo animée avec synchronisation labiale automatique.</p>
      </div>
    </div>
  </section>

  <!-- SECTION PRICING -->
  <section class="pricing">
    <h2 class="section-title">Forfaits <span class="gold-chrome">flexibles</span></h2>
    <p class="sub">Essai gratuit 24h. CB requise. Annulation instantanée.</p>
    <div class="pricing-grid">
      <!-- Starter -->
      <div class="price-card glass">
        <h3>Starter</h3>
        <div class="price"><span class="gold-chrome">9€</span><small>/mois</small></div>
        <ul>
          <li><strong>15</strong> vidéos/mois</li>
          <li><strong>50</strong> images/mois</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=starter" class="btn-outline">Commencer</a>
      </div>
      <!-- Standard -->
      <div class="price-card glass">
        <h3>Standard</h3>
        <div class="price"><span class="gold-chrome">19€</span><small>/mois</small></div>
        <ul>
          <li><strong>40</strong> vidéos/mois</li>
          <li><strong>150</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu validez 🔥</li>
        </ul>
        <a href="/signup?plan=standard" class="btn-outline">Commencer</a>
      </div>
      <!-- Pro (Popular) -->
      <div class="price-card glass popular">
        <div class="pop-badge">POPULAIRE</div>
        <h3>Pro</h3>
        <div class="price"><span class="gold-chrome">39€</span><small>/mois</small></div>
        <ul>
          <li><strong>80</strong> vidéos/mois</li>
          <li><strong>300</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Support prioritaire</li>
          <li>Paye que si tu validez 🔥</li>
        </ul>
        <a href="/signup?plan=pro" class="btn-primary">Commencer</a>
      </div>
      <!-- Studio -->
      <div class="price-card glass">
        <h3>Studio</h3>
        <div class="price"><span class="gold-chrome">79€</span><small>/mois</small></div>
        <ul>
          <li><strong>180</strong> vidéos/mois</li>
          <li><strong>800</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Support prioritaire</li>
          <li>Paye que si tu validez 🔥</li>
        </ul>
        <a href="/signup?plan=studio" class="btn-outline">Commencer</a>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-brand gold-chrome">ClipLumia</div>
    <p class="creator">Créé avec passion par une créatrice</p>
    <p class="copy">© 2026 ClipLumia. Tous droits réservés.</p>
  </footer>
</main>

<style>
  /* Global resets */
  :global(*) { box-sizing: border-box; }
  :global(html), :global(body) {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow-x: hidden;
    background: #0c0618;
  }

  /* Nav */
  .nav {
    position: fixed;
    top: 0;
    left: 0; right: 0; margin: 0 auto;
    z-index: 100;
    background: rgba(12,6,24,.85);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,.06);
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 24px; max-width: 1200px;
  }
  .logo { /* ... inchangé ... */ }
  .nav-link { /* ... inchangé ... */ }
  
  /* Hero */
  .hero {
    position: relative; z-index: 2;
    max-width: 1200px; margin: 0 auto;
    padding: 140px 24px 80px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;
  }
  /* ... (autres styles .hero et .btn-primary inchangés) ... */

  .page {
    position: relative; min-height: 100vh;
    max-width: 100vw; /* largeur du viewport */
    background-image: url('https://.../image fond.png');
    background-size: cover; background-position: center;
    background-attachment: fixed; background-repeat: no-repeat;
  }
  .page::before {
    content: "";
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(12,6,24,.42);
    z-index: 1;
  }

  /* Autres sections (concept, demos, pricing) avec .glass etc. */
  .demos { position:relative; z-index:2; padding:60px 24px; max-width:1200px; margin:0 auto; }
  .concept { position:relative; z-index:2; padding:60px 24px; max-width:1000px; margin:0 auto; }
  .pricing { position:relative; z-index:2; padding:60px 24px; max-width:1200px; margin:0 auto; }

  /* Demos grid */
  .demos-grid { display: grid; grid-template-columns: repeat(2,1fr); gap:20px; }
  .demo-card { padding:24px; width:100%; }
  .demo-card.wide { grid-column:1/-1; } 
  .screen { position: relative; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,.1); margin-bottom:14px; background:rgba(0,0,0,.2); }
  .screen img, .screen video {
    max-width: 100%; height: auto;
  }
  .watermark { /* ... inchangé ... */ }
  /* ... autres classes (btn-like, chat-box, etc.) ... */

  /* Pricing grid */
  .pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap:16px; }
  /* ... carte de prix ... */

  .footer { position: relative; z-index:2; text-align:center; padding:40px 24px; border-top:1px solid rgba(255,255,255,.06); background: rgba(0,0,0,.2); }
  /* ... */

  @media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; padding: 120px 16px 60px; gap:30px; }
    .hero h1 { font-size: 2.4rem; }
    .hero p { font-size: 1rem; }
    .steps { flex-direction: column; padding:0 8px; }
    .arrow { transform: rotate(90deg); }
    .demos-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .concept, .demos, .pricing { padding-left:16px; padding-right:16px; }
    .demo-actions { flex-direction: column; }
    .page { background-attachment: scroll; } /* corrige bug iOS */
  }
</style>
