<script>
  let demoLiked = {img: false, vid: false, lip: false};
  let chatInput = '';
  let chatMsgs = [{who:'bot', text:'Bonjour ! Décrivez votre vision...'}];
  
  function sendChat() {
    if(!chatInput.trim()) return;
    chatMsgs = [...chatMsgs, {who:'user', text: chatInput}];
    const prev = chatInput;
    chatInput = '';
    setTimeout(() => {
      chatMsgs = [...chatMsgs, {who:'bot', text:`"${prev}" — Voici votre aperçu !`}];
    }, 800);
  }
  function toggleLike(t) { demoLiked[t] = !demoLiked[t]; }
</script>

<svelte:head>
  <title>ClipLumia — Payez si vous validez</title>
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
      <h1>Créez sans risque.<br><span class="gold-chrome">Payez si vous validez.</span></h1>
      <p>Images, vidéos, voix et lipsync par IA. Générez un aperçu gratuitement. Un forfait débité uniquement si vous aimez le résultat.</p>
      <a href="/studio" class="btn-primary">Tester gratuitement</a>
      <span class="note">Sans engagement · Annulez en 2 clics</span>
    </div>
    <div class="hero-media glass">
      <video src="https://replicate.delivery/xezq/kG9nWAYgue1ye0tFQjPlaTdFexxjkqRoEvU4hmcF1k96pydtA/tmpkb9_apiq.mp4" controls muted loop playsinline></video>
      <p class="caption">Exemple généré avec ClipLumia</p>
    </div>
  </section>

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

  <section class="demos">
    <h2 class="section-title">5 outils. <span class="gold-chrome">1 studio.</span></h2>
    <div class="demos-grid">
      
      <div class="demo-card glass">
        <div class="demo-top"><span>🖼️ Images IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <div class="img-placeholder">
            <div class="placeholder-shimmer"></div>
            <span class="ph-icon">🖼️</span>
            <span class="ph-label">Votre image IA</span>
          </div>
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" class:active={demoLiked.img} on:click={()=>toggleLike('img')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.img=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">50 à 800 images/mois selon votre forfait.</p>
      </div>

      <div class="demo-card glass">
        <div class="demo-top"><span>▶️ Vidéos IA</span><span class="tag">Preview</span></div>
        <div class="screen">
          <div class="img-placeholder video">
            <div class="placeholder-shimmer"></div>
            <span class="ph-icon">▶️</span>
            <span class="ph-label">Votre vidéo IA</span>
          </div>
          <div class="watermark">CLIPLUMIA · PREVIEW</div>
        </div>
        <div class="demo-actions">
          <button class="btn-like" class:active={demoLiked.vid} on:click={()=>toggleLike('vid')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.vid=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">15 à 180 vidéos/mois. Durée 5-6 secondes.</p>
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
          <button on:click={sendChat}>Envoyer</button>
        </div>
        <p class="demo-desc">Assistant créatif intégré.</p>
      </div>

      <div class="demo-card glass">
        <div class="demo-top"><span>🎙️ Voix IA</span></div>
        <div class="voice-box">
          <div class="wave">
            <div class="bar" style="height:40%"></div><div class="bar" style="height:70%"></div>
            <div class="bar" style="height:50%"></div><div class="bar" style="height:90%"></div>
            <div class="bar" style="height:60%"></div><div class="bar" style="height:80%"></div>
          </div>
          <button class="btn-play">▶ Écouter la démo</button>
        </div>
        <p class="demo-desc">Clone et génération vocale réaliste.</p>
      </div>

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
          <button class="btn-like" class:active={demoLiked.lip} on:click={()=>toggleLike('lip')}>❤️ J'aime (1 forfait)</button>
          <button class="btn-reject" on:click={()=>demoLiked.lip=false}>🗑️ Rejeter (0 forfait)</button>
        </div>
        <p class="demo-desc">Photo animée avec synchronisation labiale automatique.</p>
      </div>

    </div>
  </section>

  <section class="pricing">
    <h2 class="section-title">Forfaits <span class="gold-chrome">flexibles</span></h2>
    <p class="sub">Essai gratuit 24h. CB requise. Annulation instantanée.</p>
    <div class="pricing-grid">
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
      <div class="price-card glass">
        <h3>Standard</h3>
        <div class="price"><span class="gold-chrome">19€</span><small>/mois</small></div>
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
        <div class="price"><span class="gold-chrome">39€</span><small>/mois</small></div>
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
        <div class="price"><span class="gold-chrome">79€</span><small>/mois</small></div>
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
    <div class="footer-brand gold-chrome">ClipLumia</div>
    <p class="creator">Créé avec passion par une créatrice</p>
    <p class="copy">© 2026 ClipLumia. Tous droits réservés.</p>
  </footer>
</main>

<style>
  :global(*){box-sizing:border-box}
  :global(body){margin:0;font-family:'Inter',system-ui,sans-serif;background:#0c0618;color:#fff;-webkit-font-smoothing:antialiased}
  
  .gold-chrome{background:linear-gradient(135deg,#D4AF37,#FFF8DC,#C5A028,#FFF8DC,#AA771C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 15px rgba(212,175,55,.4))}
  
  .page{position:relative;min-height:100vh;background:#0c0618;overflow-x:hidden;max-width:100vw}
  
  .glass{background:rgba(255,255,255,.04);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.08);transition:all .3s}
  .glass:hover{border-color:rgba(212,175,55,.25);box-shadow:0 12px 40px rgba(0,0,0,.5),0 0 30px rgba(212,175,55,.1)}
  
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(12,6,24,.8);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;padding:16px 24px;max-width:1200px;margin:0 auto;left:50%;transform:translateX(-50%)}
  .logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;background:linear-gradient(135deg,#D4AF37,#FFF8DC,#C5A028);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-decoration:none}
  .nav-link{color:rgba(255,255,255,.6);text-decoration:none;padding:8px 20px;border:1px solid rgba(255,255,255,.1);border-radius:100px;font-size:.9rem;transition:all .3s}
  .nav-link:hover{border-color:rgba(212,175,55,.5);color:#FFF8DC}
  
  .hero{max-width:1200px;margin:0 auto;padding:140px 24px 80px;display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
  .badge{display:inline-block;padding:6px 16px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);border-radius:50px;font-size:.8rem;font-weight:600;color:#FFF8DC;margin-bottom:20px;text-transform:uppercase;letter-spacing:1px}
  .hero h1{font-family:'Playfair Display',serif;font-size:3.5rem;font-weight:900;line-height:1.1;margin:0 0 20px}
  .hero p{font-size:1.1rem;line-height:1.7;color:rgba(255,255,255,.7);margin:0 0 28px;font-weight:300}
  
  .btn-primary{display:inline-block;background:linear-gradient(135deg,rgba(212,175,55,.15),rgba(212,175,55,.05));color:#FFF8DC;border:1.5px solid rgba(212,175,55,.5);padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;transition:all .3s;backdrop-filter:blur(10px);box-shadow:0 4px 15px rgba(212,175,55,.1)}
  .btn-primary:hover{background:rgba(212,175,55,.2);border-color:rgba(212,175,55,.8);box-shadow:0 8px 25px rgba(212,175,55,.25);transform:translateY(-2px)}
  
  .note{font-size:.85rem;color:rgba(255,255,255,.5);display:block;margin-top:12px}
  .hero-media{padding:12px;width:100%}
  .hero-media video{width:100%;border-radius:12px;display:block;max-width:100%}
  .caption{text-align:center;font-size:.8rem;color:rgba(255,255,255,.4);margin-top:12px}
  
  .video-placeholder, .img-placeholder {
    position: relative;
    width: 100%;
    height: 220px;
    background: linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .img-placeholder { height: 160px; }
  .placeholder-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,.08), transparent);
    animation: shimmer 3s infinite;
  }
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  .play-btn {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(212,175,55,.9), rgba(197,160,40,.9));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0c0618;
    font-size: 1.4rem;
    box-shadow: 0 0 30px rgba(212,175,55,.4);
    z-index: 2;
  }
  .ph-icon {
    font-size: 2rem;
    z-index: 2;
    opacity: .8;
  }
  .ph-label, .placeholder-text {
    color: rgba(255,255,255,.5);
    font-size: .9rem;
    font-weight: 500;
    z-index: 2;
    letter-spacing: 1px;
  }
  .placeholder-text {
    font-size: 1.1rem;
    color: rgba(212,175,55,.8);
  }
  
  .concept{padding:60px 24px;max-width:1000px;margin:0 auto}
  .section-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;text-align:center;margin:0 0 48px}
  .steps{display:flex;align-items:center;gap:20px}
  .step{flex:1;text-align:center;padding:28px 20px}
  .step span{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;display:block;margin-bottom:10px;background:linear-gradient(45deg,#D4AF37,#FFF8DC,#C5A028);-webkit-background-clip:text;-webkit-text-fill-color:transparent;opacity:.7}
  .step h4{margin:0 0 6px;font-size:1rem}
  .step p{margin:0;font-size:.85rem;color:rgba(255,255,255,.5);line-height:1.5}
  .arrow{color:rgba(212,175,55,.5);font-size:1.5rem}
  
  .demos{padding:60px 24px;max-width:1200px;margin:0 auto}
  .demos-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
  .demo-card{padding:24px;width:100%}
  .demo-card.wide{grid-column:1/-1}
  .demo-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-weight:600;font-size:.95rem}
  .tag{font-size:.7rem;padding:4px 10px;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.25);border-radius:100px;color:#FFF8DC}
  .screen{position:relative;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.1);margin-bottom:14px;background:rgba(0,0,0,.2)}
  .watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-15deg);color:rgba(255,255,255,.8);font-size:1.1rem;font-weight:900;letter-spacing:2px;text-shadow:0 0 15px rgba(0,0,0,.9);border:2px solid rgba(255,255,255,.6);padding:6px 14px;background:rgba(0,0,0,.4);pointer-events:none}
  .demo-actions{display:flex;gap:8px;margin-bottom:10px}
  .btn-like{flex:1;background:rgba(60,179,113,.1);color:#3cb371;border:1.5px solid rgba(60,179,113,.35);padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.8rem;transition:all .3s}
  .btn-like.active{background:rgba(60,179,113,.2);border-color:#3cb371;box-shadow:0 0 10px rgba(60,179,113,.15)}
  .btn-reject{flex:1;background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;font-size:.8rem;transition:all .3s}
  .btn-reject:hover{border-color:#ff6b6b;color:#ff6b6b}
  .demo-desc{font-size:.8rem;color:rgba(255,255,255,.4);margin:0;text-align:center}
  
  .chat-box{height:120px;overflow-y:auto;padding:12px;background:rgba(0,0,0,.2);border-radius:12px;margin-bottom:10px;display:flex;flex-direction:column;gap:8px}
  .msg{display:flex;align-items:flex-start;gap:6px}
  .msg.user{flex-direction:row-reverse}
  .bubble{background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.2);padding:8px 12px;border-radius:12px;color:#fff;font-size:.85rem;max-width:85%}
  .msg.user .bubble{background:rgba(90,54,150,.25);border-color:rgba(90,54,150,.35)}
  .chat-input{display:flex;gap:6px}
  .chat-input input{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px;color:#fff;outline:none;font-size:.9rem}
  .chat-input input:focus{border-color:rgba(212,175,55,.3)}
  .chat-input button{background:linear-gradient(135deg,#D4AF37,#C5A028);color:#0c0618;border:none;padding:10px 16px;border-radius:10px;font-weight:600;cursor:pointer;font-size:.9rem}
  
  .voice-box{padding:20px;text-align:center}
  .wave{display:flex;align-items:center;justify-content:center;gap:5px;height:50px;margin-bottom:14px}
  .bar{width:5px;background:linear-gradient(to top,#D4AF37,#FFF8DC);border-radius:8px;animation:sound 1.2s infinite ease-in-out}
  .bar:nth-child(2){animation-delay:.1s}.bar:nth-child(3){animation-delay:.2s}.bar:nth-child(4){animation-delay:.3s}.bar:nth-child(5){animation-delay:.4s}.bar:nth-child(6){animation-delay:.5s}
  @keyframes sound{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
  .btn-play{background:rgba(255,255,255,.03);border:1.5px solid rgba(212,175,55,.4);color:#D4AF37;padding:10px 20px;border-radius:100px;cursor:pointer;font-weight:600;font-size:.9rem}
  
  .pricing{padding:60px 24px;max-width:1200px;margin:0 auto}
  .sub{text-align:center;color:rgba(255,255,255,.5);margin:-36px 0 40px;font-size:.95rem}
  .pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .price-card{padding:28px 20px;text-align:center;position:relative}
  .price-card h3{margin:0 0 14px;font-size:1.2rem}
  .price{font-size:2.8rem;font-weight:900;margin-bottom:16px}
  .price small{font-size:.9rem;color:rgba(255,255,255,.5);font-weight:400;margin-left:4px}
  .price-card ul{list-style:none;padding:0;margin:0 0 20px;text-align:left}
  .price-card ul li{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.7);font-size:.85rem}
  .price-card ul li:last-child{border:none}
  .btn-outline{display:block;background:rgba(255,255,255,.03);border:1.5px solid rgba(212,175,55,.4);color:#FFF8DC;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:600;transition:all .3s;text-align:center}
  .btn-outline:hover{background:rgba(212,175,55,.1);border-color:rgba(212,175,55,.7);box-shadow:0 0 15px rgba(212,175,55,.1)}
  .popular{border:1.5px solid rgba(212,175,55,.3);box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 20px rgba(212,175,55,.1)}
  .pop-badge{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#D4AF37,#C5A028);color:#0c0618;padding:4px 14px;border-radius:100px;font-size:.7rem;font-weight:700}
  
  .footer{text-align:center;padding:40px 24px;border-top:1px solid rgba(255,255,255,.06)}
  .footer-brand{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;display:block;margin-bottom:10px}
  .creator{font-size:.9rem;color:rgba(255,255,255,.6);margin:0 0 6px;font-style:italic}
  .copy{font-size:.8rem;color:rgba(255,255,255,.3);margin:0}
  
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
  }
</style>
