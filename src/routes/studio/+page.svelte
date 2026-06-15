<script>
  export let data;

  let activeTab = 'images';

  // --- IMAGES ---
  let imgPrompt = '';
  let imgLoading = false;
  let imgPreviewUrl = null;
  let imgValidatedUrl = null;
  let imgGenerationId = null;
  let imgError = null;

  // --- VIDEOS ---
  let vidPrompt = '';
  let vidLoading = false;
  let vidPreviewUrl = null;
  let vidValidatedUrl = null;
  let vidGenerationId = null;
  let vidReplicateId = null;
  let vidInterval = null;
  let vidError = null;

  // --- LIPSYNC ---
  let imageBase64 = '';
  let audioUrl = '';
  let lipLoading = false;
  let lipPreviewUrl = null;
  let lipError = null;

  // --- VOIX IA ---
  let ttsText = '';
  let ttsLoading = false;
  let ttsUrl = null;
  let ttsError = null;

  // --- CHAT IA ---
  let chatInput = '';
  let chatLoading = false;
  let chatHistory = [];

  // --- GALERIE ---
  let gallery = data?.gallery || [];
  let galleryLoading = false;

  // --- PROMPTS LIBRARY ---
  const promptLibrary = [
    "Portrait corporate d'une femme, costume bleu marine, fond bureau moderne, éclairage Or Chrome, ultra détaillé",
    "Logo 3D ClipLumia, métal Or Chrome poli, fond violet foncé #1A0B2E, particules dorées flottantes",
    "Homme qui marche dans Paris au crépuscule, style cinématique, pluie, reflets néon Or",
    "Femme qui présente un produit, fond studio violet #2D1B4E, lumière douce, sourire confiant, 8k"
  ];

  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data?.user?.email);
  const canGenerateImg = isAdmin || (data?.user?.images_restantes > 0);
  const canGenerateVid = isAdmin || (data?.user?.videos_restantes > 0);
  const forfaitName = data?.user?.forfait || 'STARTER';

  async function generateImage() {
    if (!imgPrompt.trim()) return;
    imgLoading = true; imgError = null; imgPreviewUrl = null; imgValidatedUrl = null;
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: imgPrompt }) });
      const result = await res.json();
      if (!res.ok) { imgError = result.error || 'Erreur'; imgLoading = false; return; }
      imgPreviewUrl = result.url; imgGenerationId = result.id;
    } catch (e) { imgError = e.message; }
    imgLoading = false;
  }

  async function validateImage() {
    if (!imgGenerationId) return;
    try {
      const res = await fetch('/api/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: imgGenerationId, action: 'validate' }) });
      const result = await res.json();
      if (result.success) { imgValidatedUrl = imgPreviewUrl; imgPreviewUrl = null; imgGenerationId = null; loadGallery(); }
      else { imgError = result.error || 'Erreur'; }
    } catch (e) { imgError = e.message; }
  }

  function rejectImage() { imgPreviewUrl = null; imgGenerationId = null; imgValidatedUrl = null; imgPrompt = ''; }

  async function generateVideo() {
    if (!vidPrompt.trim()) return;
    vidLoading = true; vidError = null; vidPreviewUrl = null; vidValidatedUrl = null; if (vidInterval) clearInterval(vidInterval);
    try {
      const res = await fetch('/api/generate-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: vidPrompt }) });
      const result = await res.json();
      if (!res.ok) { vidError = result.error || 'Erreur'; vidLoading = false; return; }
      vidReplicateId = result.replicateId; vidGenerationId = result.id;
      vidInterval = setInterval(async () => {
        try {
          const checkRes = await fetch('/api/check-video', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ replicateId: vidReplicateId, genId: vidGenerationId }) });
          const check = await checkRes.json();
          if (check.status === 'succeeded') { clearInterval(vidInterval); vidInterval = null; vidPreviewUrl = check.url; vidLoading = false; }
          else if (check.status === 'failed') { clearInterval(vidInterval); vidInterval = null; vidError = check.error || 'Échec'; vidLoading = false; }
        } catch (e) {}
      }, 4000);
    } catch (e) { vidError = e.message; vidLoading = false; }
  }

  async function validateVideo() {
    if (!vidGenerationId) return;
    try {
      const res = await fetch('/api/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: vidGenerationId, action: 'validate', type: 'video' }) });
      const result = await res.json();
      if (result.success) { vidValidatedUrl = vidPreviewUrl; vidPreviewUrl = null; vidGenerationId = null; loadGallery(); }
      else { vidError = result.error || 'Erreur'; }
    } catch (e) { vidError = e.message; }
  }

  function rejectVideo() { if (vidInterval) clearInterval(vidInterval); vidInterval = null; vidPreviewUrl = null; vidGenerationId = null; vidValidatedUrl = null; vidPrompt = ''; vidReplicateId = null; }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) { const reader = new FileReader(); reader.onload = (e) => imageBase64 = e.target.result; reader.readAsDataURL(file); }
  }

  async function generateLipsync() {
    if (!imageBase64 || !audioUrl) return;
    lipLoading = true; lipError = null; lipPreviewUrl = null;
    try {
      const res = await fetch('/api/lipsync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: imageBase64, audio: audioUrl }) });
      const data = await res.json();
      if (res.ok && data.success) { lipPreviewUrl = data.url; loadGallery(); }
      else { lipError = data.error || 'Erreur'; }
    } catch (e) { lipError = e.message; }
    lipLoading = false;
  }

  function resetLipsync() { imageBase64 = ''; audioUrl = ''; lipPreviewUrl = null; lipError = null; }

  async function generateTTS() {
    if (!ttsText.trim()) return;
    ttsLoading = true; ttsError = null; ttsUrl = null;
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: ttsText }) });
      const data = await res.json();
      if (res.ok) { ttsUrl = data.url; } else { ttsError = data.error || 'Erreur'; }
    } catch (e) { ttsError = e.message; }
    ttsLoading = false;
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput; chatInput = ''; chatLoading = true;
    chatHistory = [...chatHistory, {role: 'user', content: userMsg}];
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg, history: chatHistory }) });
      const data = await res.json();
      chatHistory = [...chatHistory, {role: 'assistant', content: data.reply}];
    } catch (e) { chatHistory = [...chatHistory, {role: 'assistant', content: 'Erreur IA'}]; }
    chatLoading = false;
  }

  async function loadGallery() {
    galleryLoading = true;
    try {
      const res = await fetch('/api/gallery'); const data = await res.json();
      if (res.ok) gallery = data.items;
    } catch (e) {}
    galleryLoading = false;
  }
</script>

<svelte:head>
  <title>Studio Pro — ClipLumia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">ClipLumia</a>
      <a href="/#tarifs" class="nav-link">Upgrade Forfait</a>
    </div>
  </nav>

  <div class="studio-container">
    <div class="studio-header">
      <h1 class="studio-title"><span class="gold-chrome">Studio Pro</span></h1>
      <div class="credits">
        <span class="credit-pill">Forfait {forfaitName} : {data?.user?.images_restantes || 0} Images HD</span>
        <span class="credit-pill">Forfait {forfaitName} : {data?.user?.videos_restantes || 0} Vidéos HD</span>
      </div>
    </div>

    <div class="tabs">
      <button class="tab" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>Images HD</button>
      <button class="tab" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>Vidéos HD</button>
      <button class="tab" class:active={activeTab === 'lipsync'} on:click={() => activeTab = 'lipsync'}>Lipsync IA</button>
      <button class="tab" class:active={activeTab === 'voix'} on:click={() => activeTab = 'voix'}>Voix IA</button>
      <button class="tab" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>Chat IA</button>
      <button class="tab" class:active={activeTab === 'galerie'} on:click={() => {activeTab = 'galerie'; loadGallery();}}>Galerie</button>
    </div>

    <div class="tab-content glass-3d">
      {#if activeTab === 'images'}
        <div class="section">
          <div class="prompt-library">
            <label>Prompts Pro 1-clic :</label>
            <div class="prompt-grid">
              {#each promptLibrary as p}
                <button class="prompt-chip" on:click={() => imgPrompt = p}>{p.slice(0,40)}...</button>
              {/each}
            </div>
          </div>
          {#if !canGenerateImg}
            <div class="alert">Forfait {forfaitName} épuisé. <a href="/#tarifs">Passer au Forfait PRO</a></div>
          {:else}
            <div class="form">
              <label>Description de l'image</label>
              <textarea bind:value={imgPrompt} placeholder="Un portrait professionnel..." rows="4"></textarea>
              <button class="btn-primary" on:click={generateImage} disabled={imgLoading}>{imgLoading? 'Génération...' : 'Générer l\'image'}</button>
            </div>
          {/if}
          {#if imgError}<p class="error">{imgError}</p>{/if}
          {#if imgPreviewUrl &&!imgValidatedUrl}
            <div class="preview-box">
              <span class="preview-badge">Aperçu</span>
              <div class="preview-media"><img src={imgPreviewUrl} alt="Aperçu" /><div class="watermark">CLIPLUMIA · PREVIEW</div></div>
              <p class="preview-info">Validez pour obtenir la version HD sans filigrane.</p>
              <div class="actions">
                <button class="btn-validate" on:click={validateImage}>❤️ J'aime (1 forfait)</button>
                <button class="btn-reject" on:click={rejectImage}>🗑️ Rejeter (0 forfait)</button>
              </div>
            </div>
          {/if}
          {#if imgValidatedUrl}
            <div class="result-box">
              <span class="result-badge">Image validée HD</span>
              <img src={imgValidatedUrl} alt="Résultat" />
              <button class="btn-secondary" on:click={() => { imgValidatedUrl = null; imgPrompt = ''; }}>Nouvelle image</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'video'}
        <div class="section">
          {#if !canGenerateVid}
            <div class="alert">Forfait {forfaitName} épuisé. <a href="/#tarifs">Passer au Forfait PRO</a></div>
          {:else}
            <div class="form">
              <label>Description de la vidéo</label>
              <textarea bind:value={vidPrompt} placeholder="Une femme marchant..." rows="4"></textarea>
              <p class="hint">Durée : 5-6s · Génération : 30-60s</p>
              <button class="btn-primary" on:click={generateVideo} disabled={vidLoading}>{vidLoading? 'Génération...' : 'Générer la vidéo'}</button>
            </div>
          {/if}
          {#if vidError}<p class="error">{vidError}</p>{/if}
          {#if vidLoading &&!vidPreviewUrl}<div class="loading-state"><div class="spinner"></div><p>Génération en cours...</p></div>{/if}
          {#if vidPreviewUrl &&!vidValidatedUrl}
            <div class="preview-box">
              <span class="preview-badge">Aperçu</span>
              <div class="preview-media"><video src={vidPreviewUrl} controls loop muted playsinline></video><div class="watermark">CLIPLUMIA · PREVIEW</div></div>
              <div class="actions">
                <button class="btn-validate" on:click={validateVideo}>❤️ J'aime (1 forfait)</button>
                <button class="btn-reject" on:click={rejectVideo}>🗑️ Rejeter (0 forfait)</button>
              </div>
            </div>
          {/if}
          {#if vidValidatedUrl}
            <div class="result-box">
              <span class="result-badge">Vidéo validée HD</span>
              <video src={vidValidatedUrl} controls loop playsinline></video>
              <button class="btn-secondary" on:click={() => { vidValidatedUrl = null; vidPrompt = ''; }}>Nouvelle vidéo</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'lipsync'}
        <div class="section">
          <div class="form">
            <label>1. Photo du visage</label>
            <input type="file" accept="image/*" on:change={handleImageUpload} />
            {#if imageBase64}<div class="upload-preview"><img src={imageBase64} alt="Upload" /></div>{/if}
            <label>2. URL de l'audio MP3/WAV</label>
            <input type="text" bind:value={audioUrl} placeholder="https://..." />
            <button class="btn-primary" on:click={generateLipsync} disabled={lipLoading ||!imageBase64 ||!audioUrl}>{lipLoading? 'Sync...' : 'Générer le lipsync'}</button>
          </div>
          {#if lipError}<p class="error">{lipError}</p>{/if}
          {#if lipPreviewUrl}
            <div class="result-box">
              <span class="result-badge">Lipsync HD</span>
              <video src={lipPreviewUrl} controls loop playsinline></video>
              <button class="btn-secondary" on:click={resetLipsync}>Nouveau lipsync</button>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'voix'}
        <div class="section">
          <div class="form">
            <label>Texte à transformer en voix IA</label>
            <textarea bind:value={ttsText} placeholder="Bonjour, bienvenue chez ClipLumia..." rows="4"></textarea>
            <button class="btn-primary" on:click={generateTTS} disabled={ttsLoading}>{ttsLoading? 'Génération...' : 'Générer la voix IA'}</button>
          </div>
          {#if ttsError}<p class="error">{ttsError}</p>{/if}
          {#if ttsUrl}
            <div class="result-box">
              <span class="result-badge">Voix générée</span>
              <audio src={ttsUrl} controls></audio>
            </div>
          {/if}
        </div>
      {/if}

      {#if activeTab === 'chat'}
        <div class="section">
          <div class="chat-box">
            {#each chatHistory as msg}
              <div class="chat-msg {msg.role}">{msg.content}</div>
            {/each}
            {#if chatLoading}<div class="chat-msg assistant"><div class="spinner-small"></div></div>{/if}
          </div>
          <div class="form">
            <input type="text" bind:value={chatInput} placeholder="Pose une question sur tes créations..." on:keydown={(e) => e.key === 'Enter' && sendChat()} />
            <button class="btn-primary" on:click={sendChat} disabled={chatLoading}>Envoyer</button>
          </div>
        </div>
      {/if}

      {#if activeTab === 'galerie'}
        <div class="section">
          <h3 class="section-title">Tes créations validées</h3>
          {#if galleryLoading}<div class="loading-state"><div class="spinner"></div></div>
          {:else if gallery.length === 0}<p class="hint">Aucune création validée pour l'instant.</p>
          {:else}
            <div class="gallery-grid">
              {#each gallery as item}
                <div class="gallery-item">
                  {#if item.type === 'image'}<img src={item.url} alt="Gen" />{:else}<video src={item.url} muted loop></video>{/if}
                  <span class="gallery-badge">{item.type}</span>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) { margin: 0; font-family: 'Inter', sans-serif; background: #1A0B2E; color: #f0f0f5; -webkit-font-smoothing: antialiased; }
  .gold-chrome { background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.4)); }
  .page { background: radial-gradient(ellipse at 20% 0%, rgba(76, 42, 133, 0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(45, 27, 78, 0.2) 0%, transparent 50%), #1A0B2E; min-height: 100vh; padding-bottom: 60px; }
  .nav { background: rgba(26, 11, 46, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(191, 149, 63, 0.15); }
  .nav-inner { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-decoration: none; }
  .nav-link { color: rgba(252, 246, 186, 0.7); text-decoration: none; font-size: 0.85rem; transition: color 0.3s; }
  .nav-link:hover { color: #FCF6BA; }
  .studio-container { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
  .studio-header { text-align: center; margin-bottom: 32px; }
  .studio-title { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 900; margin: 0 0 16px 0; color: #fff; }
  .credits { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .credit-pill { background: rgba(191, 149, 63, 0.12); border: 1px solid rgba(191, 149, 63, 0.3); color: #FCF6BA; padding: 6px 16px; border-radius: 100px; font-size: 0.85rem; font-weight: 500; box-shadow: 0 0 20px rgba(191, 149, 63, 0.1); }
  .tabs { display: flex; gap: 8px; margin-bottom: 24px; justify-content: center; flex-wrap: wrap; }
  .tab { background: rgba(45, 27, 78, 0.6); border: 1px solid rgba(76, 42, 133, 0.4); color: rgba(255, 255, 255, 0.6); padding: 10px 24px; border-radius: 100px; cursor: pointer; font-weight: 500; font-size: 0.9rem; transition: all 0.3s; }
  .tab:hover { border-color: rgba(191, 149, 63, 0.5); color: #FCF6BA; background: rgba(58, 31, 107, 0.8); }
  .tab.active { background: linear-gradient(135deg, #BF953F, #B38728); border-color: transparent; color: #1A0B2E; font-weight: 600; box-shadow: 0 4px 20px rgba(191, 149, 63, 0.4); }
  .glass-3d { background: #2D1B4E; backdrop-filter: blur(24px) saturate(150%); border: 1px solid rgba(76, 42, 133, 0.6); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 0 1px rgba(191, 149, 63, 0.15); padding: 40px; }
  .section { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .section-title { font-family: 'Playfair Display', serif; color: #FCF6BA; margin: 0 0 20px 0; }
  .form { display: flex; flex-direction: column; gap: 16px; }
  .form label { font-size: 0.9rem; font-weight: 600; color: #FCF6BA; }
  textarea, input[type="text"] { width: 100%; background: rgba(26, 11, 46, 0.6); border: 1px solid rgba(76, 42, 133, 0.5); border-radius: 12px; padding: 14px; color: #fff; font-family: inherit; font-size: 1rem; resize: vertical; box-sizing: border-box; outline: none; transition: border-color 0.3s; }
  textarea:focus, input[type="text"]:focus { border-color: rgba(191, 149, 63, 0.6); box-shadow: 0 0 0 3px rgba(191, 149, 63, 0.1); }
  textarea::placeholder, input::placeholder { color: rgba(255, 255, 255, 0.3); }
  input[type="file"] { color: rgba(252, 246, 186, 0.7); font-size: 0.9rem; }
  .hint { font-size: 0.85rem; color: rgba(252, 246, 186, 0.5); margin: -8px 0 0 0; }
  .btn-primary { background: linear-gradient(135deg, #BF953F 0%, #B38728 50%, #AA771C 100%); color: #1A0B2E; padding: 14px 28px; border-radius: 12px; border: none; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 20px rgba(191, 149, 63, 0.3); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(191, 149, 63, 0.5); filter: brightness(1.1); }
  .btn-primary:disabled { opacity: 0.6; cursor: wait; }
  .btn-secondary { background: transparent; border: 1px solid rgba(191, 149, 63, 0.4); color: #BF953F; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
  .btn-secondary:hover { background: rgba(191, 149, 63, 0.1); border-color: #FCF6BA; color: #FCF6BA; }
  .btn-validate { background: linear-gradient(135deg, #2d8a4e, #3cb371); color: #fff; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(60, 179, 113, 0.3); }
  .btn-validate:hover { filter: brightness(1.15); transform: translateY(-1px); }
  .btn-reject { background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.6); padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
  .btn-reject:hover { border-color: #ff6b6b; color: #ff6b6b; background: rgba(255, 107, 107, 0.05); }
  .alert { background: rgba(191, 149, 63, 0.1); border: 1px solid rgba(191, 149, 63, 0.3); color: #FCF6BA; padding: 16px; border-radius: 12px; text-align: center; }
  .alert a { color: #fff; text-decoration: underline; font-weight: 600; }
  .error { color: #ff6b6b; font-size: 0.95rem; margin: 8px 0 0 0; }
  .preview-box,.result-box { margin-top: 32px; text-align: center; }
  .preview-badge,.result-badge { display: inline-block; padding: 6px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .preview-badge { background: rgba(191, 149, 63, 0.15); border: 1px solid rgba(191, 149, 63, 0.4); color: #FCF6BA; }
  .result-badge { background: rgba(45, 138, 78, 0.15); border: 1px solid rgba(60, 179, 113, 0.4); color: #3cb371; }
  .preview-media { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(76, 42, 133, 0.6); display: inline-block; max-width: 100%; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4); }
  .preview-media img,.preview-media video,.result-box video,.result-box img,.gallery-item img,.gallery-item video { max-width: 100%; display: block; border-radius: 16px; }
  .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); color: rgba(255, 255, 255, 0.85); font-size: 1.5rem; font-weight: 900; letter-spacing: 4px; text-shadow: 0 0 20px rgba(0,0,0,0.9); border: 2px solid rgba(255,255,255,0.8); padding: 8px 20px; background: rgba(0,0,0,0.4); pointer-events: none; }
  .preview-info { font-size: 0.9rem; color: rgba(252, 246, 186, 0.6); margin: 16px 0; }
  .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .loading-state { text-align: center; padding: 40px; }
  .spinner { width: 40px; height: 40px; border: 3px solid rgba(191, 149, 63, 0.2); border-top-color: #BF953F; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
  .spinner-small { width: 20px; height: 20px; border: 2px solid rgba(191, 149, 63, 0.2); border-top-color: #BF953F; border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .upload-preview { margin: 8px 0; }
  .upload-preview img { max-width: 200px; border-radius: 12px; border: 1px solid rgba(76, 42, 133, 0.6); }
  .prompt-library { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid rgba(76, 42, 133, 0.4); }
  .prompt-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 12px; }
  .prompt-chip { background: rgba(26, 11, 46, 0.6); border: 1px solid rgba(76, 42, 133, 0.5); color: rgba(252, 246, 186, 0.8); padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; text-align: left; transition: all 0.2s; }
  .prompt-chip:hover { border-color: #BF953F; color: #FCF6BA; background: rgba(58, 31, 107, 0.6); }
  .chat-box { background: rgba(26, 11, 46, 0.4); border: 1px solid rgba(76, 42, 133, 0.4); border-radius: 12px; padding: 16px; min-height: 300px; max-height: 400px; overflow-y: auto; margin-bottom: 16px; }
  .chat-msg { padding: 10px 14px; border-radius: 12px; margin-bottom: 12px; max-width: 80%; line-height: 1.5; }
  .chat-msg.user { background: linear-gradient(135deg, #BF953F, #B38728); color: #1A0B2E; margin-left: auto; font-weight: 500; }
  .chat-msg.assistant { background: rgba(45, 27, 78, 0.8); color: #f0f0f5; border: 1px solid rgba(76, 42, 133, 0.5); }
  .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
  .gallery-item { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(76, 42, 133, 0.6); transition: transform 0.2s; cursor: pointer; }
  .gallery-item:hover { transform: scale(1.05); box-shadow: 0 8px 30px rgba(191, 149, 63, 0.3); }
  .gallery-badge { position: absolute; top: 8px; right: 8px; background: rgba(26, 11, 46, 0.8); color: #FCF6BA; padding: 4px 10px; border-radius: 100px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
  audio { width: 100%; margin-top: 16px; }
  @media (max-width: 600px) {
    .glass-3d { padding: 24px; }
    .studio-title { font-size: 2rem; }
    .tabs { flex-wrap: wrap; }
    .actions { flex-direction: column; }
    .prompt-grid { grid-template-columns: 1fr; }
    .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  }
</style>
