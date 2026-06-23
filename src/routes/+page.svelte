<script>
  let demoLiked = {img: false, vid: false, lip: false};
  let chatInput = '';
  let chatMsgs = [{who:'bot', text:'Bonjour! Décrivez votre vision...'}];

  function sendChat() {
    if(!chatInput.trim()) return;
    chatMsgs = [...chatMsgs, {who:'user', text: chatInput}];
    const prev = chatInput;
    chatInput = '';
    setTimeout(() => {
      chatMsgs = [...chatMsgs, {who:'bot', text:`"${prev}" — Voici votre aperçu!`}];
    }, 800);
  }

  function toggleLike(t) {
    demoLiked[t] =!demoLiked[t];
  }

  function playVoiceDemo() {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance("Bonjour, bienvenue sur mon site ClipLumia");
      u.lang = 'fr-FR';
      u.rate = 0.9;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    }
  }
</script>

<svelte:head>
  <title>ClipLumia - Forfait simple.</title>
  <meta name="description" content="ClipLumia - Forfait simple. STOP LES VIDÉOS RATÉES : Tu génères avec filigrane avant validation. Tu kiffes? Tu valides = 1 sur forfait. Tu kiffes pas? Rejeter = 0 sur forfait. Sans engagement. Annule en 2 clics.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <nav class="nav">
    <a href="/" class="logo">ClipLumia</a>
    <a href="/studio" class="nav-link">Studio</a>
  </nav>

  <section class="hero">
    <div class="hero-text">
      <span class="badge">Studio IA Professionnel</span>
      <h1>Respire. Tu génères.<br><span class="OR-CHROME">Enfin une IA honnête.</span></h1>
      <div class="hero-concept">
        <div class="concept-line">
          ✓ <strong>STOP LES CRÉDITS</strong><br>
          80 vidéos/mois. Pas de compteur qui stresse.
        </div>
        <div class="concept-line">
          ✓ <strong>STOP LES VIDÉOS RATÉES</strong><br>
          Tu génères avec filigrane.<br>
          Tu aimes? Validation.<br>
          Tu n'aimes pas? <strong>0€ décompté.</strong>
        </div>
      </div>
      <a href="/studio" class="btn-primary">Tester gratuitement</a>
      <span class="note">Sans engagement · Annulez en 2 clics</span>
    </div>
    <div class="hero-media glass">
     <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/VIDEOFEMME1%20ACCEUIL.mp4" controls muted loop playsinline preload="metadata"></video>
      <p class="caption">Exemple généré avec ClipLumia</p>
    </div>
  </section>

  <section class="concept">
    <h2 class="section-title">Zéro gaspillage. <span class="OR-CHROME">100% contrôle.</span></h2>
    <div class="steps">
      <div class="step glass"><span>1</span><h4>Générez</h4><p>Aperçu avec filigrane</p></div>
      <div class="arrow">→</div>
      <div class="step glass"><span>2</span><h4>Validez</h4><p>❤️ = 1 forfait. 🗑️ = 0.</p></div>
      <div class="arrow">→</div>
      <div class="step glass"><span>3</span><h4>Téléchargez</h4><p>Version HD immédiate</p></div>
    </div>
  </section>

  <section class="demos">
    <h2 class="section-title">5 outils. <span class="OR-CHROME">1 studio.</span></h2>
    <div class="demos-grid">
      <div class="demo-card glass">
        <div class="demo-top"><span>🖼️ Images IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <img src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop&auto=format" alt="Demo IA" loading="lazy">
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('img')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.img=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">50 à 800 images/mois</p>
      </div>

      <div class="demo-card glass">
        <div class="demo-top"><span>▶️ Vidéos IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/video%20gtr%201.mp4" muted loop playsinline preload="metadata"></video>
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('vid')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.vid=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">15 à 180 vidéos/mois</p>
      </div>

      <div class="demo-card glass">
        <div class="demo-top"><span>💬 Chat IA</span></div>
        <div class="chat-box">
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
        <p class="demo-desc">Assistant créatif</p>
      </div>

      <div class="demo-card glass">
        <div class="demo-top"><span>🎙️ Voix IA</span></div>
        <div class="voice-box">
          <div class="wave">
            <div class="bar" style="height:40%"></div><div class="bar" style="height:70%"></div>
            <div class="bar" style="height:50%"></div><div class="bar" style="height:90%"></div>
            <div class="bar" style="height:60%"></div><div class="bar" style="height:80%"></div>
          </div>
          <button class="btn-play" on:click={playVoiceDemo}>▶ Écouter la voix</button>
        </div>
        <p class="demo-desc">Voix française IA</p>
      </div>

    <div class="demo-card glass">
      <div class="demo-top"><span>🎭 Lipsync IA</span><span class="tag">Preview</span></div>
       <div class="screen">
        <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/VIDEOFEMME1%20ACCEUIL.mp4" muted loop playsinline preload="metadata"></video>
        <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" on:click={()=>toggleLike('lip')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.lip=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">Photo animée avec voix</p>
      </div>
    </div>
  </section>

  <section class="pricing">
    <h2 class="section-title">Forfaits <span class="OR-CHROME">flexibles</span></h2>
    <p class="sub">Essai gratuit 24h. CB requise.</p>
    <div class="pricing-grid">
      <div class="price-card glass">
        <h3>Starter</h3>
        <div class="price"><span class="OR-CHROME">9€</span><small>/mois</small></div>
        <ul>
          <li><strong>15</strong> vidéos/mois</li>
          <li><strong>50</strong> images/mois</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=starter" class="btn-outline">Commencer</a>
      </div>
      <div class="price-card glass">
        <h3>Standard</h3>
        <div class="price"><span class="OR-CHROME">19€</span><small>/mois</small></div>
        <ul>
          <li><strong>40</strong> vidéos/mois</li>
          <li><strong>150</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=standard" class="btn-outline">Commencer</a>
      </div>
      <div class="price-card glass popular">
        <div class="pop-badge">POPULAIRE</div>
        <h3>Pro</h3>
        <div class="price"><span class="OR-CHROME">39€</span><small>/mois</small></div>
        <ul>
          <li><strong>80</strong> vidéos/mois</li>
          <li><strong>300</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Support prioritaire</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=pro" class="btn-primary">Commencer</a>
      </div>
      <div class="price-card glass">
        <h3>Studio</h3>
        <div class="price"><span class="OR-CHROME">79€</span><small>/mois</small></div>
        <ul>
          <li><strong>180</strong> vidéos/mois</li>
          <li><strong>800</strong> images/mois</li>
          <li>Voix IA Lynk</li>
          <li>Support prioritaire</li>
          <li>Paye que si tu valides 🔥</li>
        </ul>
        <a href="/signup?plan=studio" class="btn-outline">Commencer</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="footer-brand OR-CHROME">ClipLumia</div>
    <p class="creator">Créé avec passion par une créatrice</p>
    <p class="copy">© 2026 ClipLumia. Tous droits réservés.</p>
  </footer>
</main>

  <style>
  :global(*){box-sizing:border-box}
  :global(body){margin:0;font-family:'Inter',system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden}

  /* GOLD-CHROME METALLIQUE IDENTIQUE AU LOGO */
    .OR-CHROME {
    background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C);
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
    color:transparent;
    filter:drop-shadow(0 0 8px rgba(191,149,63,.6));
  }

 .page{
    position:relative;
    min-height:100vh;
    overflow-x:hidden;
    max-width:100vw;
    background-image:url('https://pub-6476d128f599432f96789b76ebbca25a.r2.dev/image%20fond%20page%20svelte.png');
    background-size:cover;
    background-position:center;
    background-attachment:fixed;
    background-repeat:no-repeat
  }
 .page::before{
    content:'';
    position:fixed;
    inset:0;
    background:rgba(12,6,24,.6);
    z-index:0;
    pointer-events:none
  }

 .glass{
    position:relative;
    background:rgba(255,255,255,.04);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,.12);
    border-radius:20px;
    box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.08);
    z-index:2
  }

 .nav{
    position:fixed;
    top:0;
    left:0;
    right:0;
    z-index:100;
    background:rgba(12,6,24,.85);
    backdrop-filter:blur(20px);
    border-bottom:1px solid rgba(255,255,255,.06);
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:20px 32px;
    max-width:1200px;
    margin:0 auto;
    left:50%;
    transform:translateX(-50%)
  }
 .logo{
    font-family:'Playfair Display',serif;
    font-size:2.2rem;
    font-weight:900;
    letter-spacing:-1px;
    background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    filter:drop-shadow(0 0 8px rgba(191,149,63,.6));
    text-decoration:none
  }
 .nav-link{
    color:rgba(255,255,255,.6);
    text-decoration:none;
    padding:8px 20px;
    border:1px solid rgba(255,255,255,.1);
    border-radius:100px;
    font-size:.9rem;
    transition:all.3s
  }
 .nav-link:hover{
    border-color:rgba(191,149,63,.5);
    color:#FCF6BA
  }

 .hero{
    position:relative;
    z-index:2;
    max-width:1200px;
    margin:0 auto;
    padding:140px 24px 80px;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:50px;
    align-items:center
  }
 .badge{
    display:inline-block;
    padding:6px 16px;
    background:rgba(191,149,63,.12);
    border:1px solid rgba(191,149,63,.3);
    border-radius:50px;
    font-size:.8rem;
    font-weight:600;
    color:#FCF6BA;
    margin-bottom:20px;
    text-transform:uppercase;
    letter-spacing:1px
  }
 .hero h1{
    font-family:'Playfair Display',serif;
    font-size:3.5rem;
    font-weight:900;
    line-height:1.1;
    margin:0 0 20px;
    text-shadow:0 2px 10px rgba(0,0,0,.9)
  }
 .hero p{
    font-size:1.1rem;
    line-height:1.7;
    color:rgba(255,255,255,.85);
    margin:0 0 28px;
    font-weight:300;
    text-shadow:0 2px 8px rgba(0,0,0,.9)
  }

 .hero-concept{
    margin:28px 0;
    display:flex;
    flex-direction:column;
    gap:16px
  }
 .concept-line{
    padding:18px;
    border-radius:16px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(191,149,63,.15);
    backdrop-filter:blur(6px);
    color:#ffffff;
    font-size:1rem;
    line-height:1.7;
    box-shadow:0 0 20px rgba(191,149,63,.05);
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }
 .concept-line strong{
    color:#FCF6BA;
    font-weight:700
  }

 .btn-primary{
    display:inline-block;
    background:linear-gradient(135deg,rgba(191,149,63,.2),rgba(191,149,63,.05));
    color:#FCF6BA;
    border:1.5px solid rgba(191,149,63,.5);
    padding:14px 32px;
    border-radius:12px;
    text-decoration:none;
    font-weight:700;
    transition:all.3s;
    backdrop-filter:blur(10px);
    box-shadow:0 4px 15px rgba(191,149,63,.15)
  }
 .btn-primary:hover{
    background:rgba(191,149,63,.25);
    border-color:rgba(191,149,63,.8);
    box-shadow:0 8px 25px rgba(191,149,63,.3);
    transform:translateY(-2px)
  }

 .note{
    font-size:.85rem;
    color:rgba(255,255,255,.6);
    display:block;
    margin-top:12px;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }
 .hero-media{
    padding:12px;
    width:100%;
    position:relative;
    z-index:2
  }
 .hero-media video{
    width:100%;
    border-radius:12px;
    display:block;
    max-width:100%
  }
 .caption{
    text-align:center;
    font-size:.8rem;
    color:rgba(255,255,255,.5);
    margin-top:12px;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }

 .concept{
    position:relative;
    z-index:2;
    padding:60px 24px;
    max-width:1000px;
    margin:0 auto
  }
 .section-title{
    font-family:'Playfair Display',serif;
    font-size:2.2rem;
    font-weight:700;
    text-align:center;
    margin:0 0 48px;
    text-shadow:0 2px 10px rgba(0,0,0,.9)
  }
 .steps{
    display:flex;
    align-items:center;
    gap:20px
  }
 .step{
    flex:1;
    text-align:center;
    padding:28px 20px
  }
 .step span{
    font-family:'Playfair Display',serif;
    font-size:2.2rem;
    font-weight:900;
    display:block;
    margin-bottom:10px;
    background:linear-gradient(45deg,#BF953F,#FCF6BA,#B38728);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    opacity:.8
  }
 .step h4{
    margin:0 0 6px;
    font-size:1rem;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }
 .step p{
    margin:0;
    font-size:.85rem;
    color:rgba(255,255,255,.7);
    line-height:1.5;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }
 .arrow{
    color:rgba(191,149,63,.5);
    font-size:1.5rem
  }

 .demos{
    position:relative;
    z-index:2;
    padding:60px 24px;
    max-width:1200px;
    margin:0 auto
  }
 .demos-grid{
    display:flex;
    flex-direction:column;
    gap:24px;
    width:100%;
  }
  @media (min-width:901px){
   .demos-grid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:24px;
    }
  }
 .demo-card{
    padding:24px;
    width:100%
  }
 .demo-card.wide{
    grid-column:1/-1
  }
 .demo-top{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:14px;
    font-weight:600;
    font-size:.95rem
  }
 .tag{
    font-size:.7rem;
    padding:4px 10px;
    background:rgba(191,149,63,.1);
    border:1px solid rgba(191,149,63,.25);
    border-radius:100px;
    color:#FCF6BA
  }

  /* PATCH CARRÉ - pas trop petit sur ordi */
 .screen{
    position:relative;
    border-radius:14px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.1);
    margin-bottom:14px;
    background:rgba(0,0,0,.2);
    width:100%;
    aspect-ratio:1/1;
    height:auto;
  }
  @media (min-width:901px){
   .screen{
      max-width:480px;
      margin-left:auto;
      margin-right:auto;
    }
  }
 .screen img,.screen video{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
  }
 .watermark{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%) rotate(-15deg);
    color:rgba(255,255,255,.8);
    font-size:1.1rem;
    font-weight:900;
    letter-spacing:2px;
    text-shadow:0 0 15px rgba(0,0,0,.9);
    border:2px solid rgba(255,255,255,.6);
    padding:6px 14px;
    background:rgba(0,0,0,.4);
    pointer-events:none
  }
 .demo-actions{
    display:flex;
    gap:8px;
    margin-bottom:10px
  }
 .btn-like{
    flex:1;
    background:rgba(60,179,113,.1);
    color:#3cb371;
    border:1.5px solid rgba(60,179,113,.35);
    padding:8px 12px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
    font-size:.8rem;
    transition:all.3s
  }
 .btn-reject{
    flex:1;
    background:rgba(255,255,255,.03);
    border:1.5px solid rgba(255,255,255,.1);
    color:rgba(255,255,255,.5);
    padding:8px 12px;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
    font-size:.8rem;
    transition:all.3s
  }
 .btn-reject:hover{
    border-color:#ff6b6b;
    color:#ff6b6b
  }
 .demo-desc{
    font-size:.8rem;
    color:rgba(255,255,255,.5);
    margin:0;
    text-align:center;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }

 .chat-box{
    height:120px;
    overflow-y:auto;
    padding:12px;
    background:rgba(0,0,0,.2);
    border-radius:12px;
    margin-bottom:10px;
    display:flex;
    flex-direction:column;
    gap:8px
  }
 .msg{
    display:flex;
    align-items:flex-start;
    gap:6px
  }
 .msg.user{
    flex-direction:row-reverse
  }
 .bubble{
    background:rgba(191,149,63,.12);
    border:1px solid rgba(191,149,63,.2);
    padding:8px 12px;
    border-radius:12px;
    color:#fff;
    font-size:.85rem;
    max-width:85%
  }
 .msg.user.bubble{
    background:rgba(90,54,150,.25);
    border-color:rgba(90,54,150,.35)
  }
 .chat-input{
    display:flex;
    gap:6px
  }
 .chat-input input{
    flex:1;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.1);
    border-radius:10px;
    padding:10px;
    color:#fff;
    outline:none;
    font-size:.9rem
  }
 .chat-input input:focus{
    border-color:rgba(191,149,63,.3)
  }
 .chat-input button{
    background:linear-gradient(135deg,#BF953F,#B38728);
    color:#0c0618;
    border:none;
    padding:10px 16px;
    border-radius:10px;
    font-weight:600;
    cursor:pointer;
    font-size:.9rem
  }

 .voice-box{
    padding:20px;
    text-align:center
  }
 .wave{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:5px;
    height:50px;
    margin-bottom:14px
  }
 .bar{
    width:5px;
    background:linear-gradient(to top,#BF953F,#FCF6BA);
    border-radius:8px;
    animation:sound 1.2s infinite ease-in-out
  }
 .bar:nth-child(2){animation-delay:.1s}
 .bar:nth-child(3){animation-delay:.2s}
 .bar:nth-child(4){animation-delay:.3s}
 .bar:nth-child(5){animation-delay:.4s}
 .bar:nth-child(6){animation-delay:.5s}
  @keyframes sound{
    0%,100%{transform:scaleY(.3)}
    50%{transform:scaleY(1)}
  }
 .btn-play{
    background:rgba(255,255,255,.03);
    border:1.5px solid rgba(191,149,63,.4);
    color:#FCF6BA;
    padding:10px 20px;
    border-radius:100px;
    cursor:pointer;
    font-weight:600;
    font-size:.9rem;
    transition:all.3s
  }
 .btn-play:hover{
    background:rgba(191,149,63,.1);
    box-shadow:0 0 15px rgba(191,149,63,.15)
  }

 .img-placeholder{
    position:relative;
    width:100%;
    height:100%;
    background:linear-gradient(135deg,#1a0a2e 0%,#2d1b4e 50%,#1a0a2e 100%);
    border-radius:12px;
    overflow:hidden;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:12px
  }
 .placeholder-shimmer{
    position:absolute;
    top:0;
    left:-100%;
    width:100%;
    height:100%;
    background:linear-gradient(90deg,transparent,rgba(191,149,63,.08),transparent);
    animation:shimmer 3s infinite
  }
  @keyframes shimmer{
    0%{left:-100%}
    100%{left:100%}
  }
 .ph-icon{
    font-size:2rem;
    z-index:2;
    opacity:.8
  }
 .ph-label{
    color:rgba(255,255,255,.5);
    font-size:.9rem;
    font-weight:500;
    z-index:2;
    letter-spacing:1px
  }

 .pricing{
    position:relative;
    z-index:2;
    padding:60px 24px;
    max-width:1200px;
    margin:0 auto
  }
 .sub{
    text-align:center;
    color:rgba(255,255,255,.6);
    margin:-36px 0 40px;
    font-size:.95rem;
    text-shadow:0 1px 4px rgba(0,0,0,.8)
  }
 .pricing-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px
  }
 .price-card{
    padding:28px 20px;
    text-align:center;
    position:relative
  }
 .price-card h3{
    margin:0 0 14px;
    font-size:1.2rem
  }
 .price{
    font-size:2.8rem;
    font-weight:900;
    margin-bottom:16px
  }
 .price small{
    font-size:.9rem;
    color:rgba(255,255,255,.5);
    font-weight:400;
    margin-left:4px
  }
 .price-card ul{
    list-style:none;
    padding:0;
    margin:0 0 20px;
    text-align:left
  }
 .price-card ul li{
    padding:6px 0;
    border-bottom:1px solid rgba(255,255,255,.06);
    color:rgba(255,255,255,.7);
    font-size:.85rem
  }
 .price-card ul li:last-child{
    border:none
  }
 .btn-outline{
    display:block;
    background:rgba(255,255,255,.03);
    border:1.5px solid rgba(191,149,63,.4);
    color:#FCF6BA;
    padding:10px 20px;
    border-radius:10px;
    text-decoration:none;
    font-weight:600;
    transition:all.3s;
    text-align:center
  }
 .btn-outline:hover{
    background:rgba(191,149,63,.1);
    border-color:rgba(191,149,63,.7);
    box-shadow:0 0 15px rgba(191,149,63,.1)
  }
 .popular{
    border:1.5px solid rgba(191,149,63,.3);
    box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 20px rgba(191,149,63,.1)
  }
 .pop-badge{
    position:absolute;
    top:-10px;
    left:50%;
    transform:translateX(-50%);
    background:linear-gradient(135deg,#BF953F,#B38728);
    color:#0c0618;
    padding:4px 14px;
    border-radius:100px;
    font-size:.7rem;
    font-weight:700
  }

 .footer{
    position:relative;
    z-index:2;
    text-align:center;
    padding:40px 24px;
    border-top:1px solid rgba(255,255,255,.06);
      background:rgba(0,0,0,.2)
  }
  .footer-brand{
    font-family:'Playfair Display',serif;
    font-size:1.4rem;
    font-weight:700;
    display:block;
    margin-bottom:10px
  }
  .creator{
    font-size:.9rem;
    color:rgba(255,255,255,.6);
    margin:0 0 6px;
    font-style:italic
  }
  .copy{
    font-size:.8rem;
    color:rgba(255,255,255,.3);
    margin:0
  }

  @media(max-width:900px){
    .nav{padding:16px;width:100%;left:0;transform:none;border-radius:0}
    .hero{grid-template-columns:1fr;padding:120px 16px 60px;gap:30px}
    .hero h1{font-size:2.4rem}
    .hero p{font-size:1rem}
    .steps{flex-direction:column;padding:0 8px}
    .arrow{transform:rotate(90deg)}
    .demos-grid{grid-template-columns:1fr}
    .pricing-grid{grid-template-columns:1fr}
    .concept,.demos,.pricing{padding-left:16px;padding-right:16px}
    .demo-actions{flex-direction:column}
    .page{background-attachment:scroll}
  }
  .demos-grid{
  display:flex !important;
  flex-direction:column !important;
  gap:24px !important;
  width:100% !important;
  max-width:520px !important;
  margin:0 auto !important;
}

.demo-card{
  width:100% !important;
  max-width:520px !important;
  margin:0 auto !important;
}

</style>

