<script>
  export let data;
  
  // === LOGIQUE EXISTANTE INTACTE ===
  let activeTab = 'images'; // Gardé pour compatibilité interne mais non utilisé visuellement
  
  let imgPrompt = '';
  let imgLoading = false;
  let imgPreviewUrl = null;
  let imgValidatedUrl = null;
  let imgGenerationId = null;
  let imgError = null;
  
  let vidPrompt = '';
  let vidLoading = false;
  let vidPreviewUrl = null;
  let vidValidatedUrl = null;
  let vidGenerationId = null;
  let vidReplicateId = null;
  let vidInterval = null;
  let vidError = null;
  
  let imageBase64 = '';
  let audioUrl = '';
  let lipLoading = false;
  let lipPreviewUrl = null;
  let lipError = null;
  
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data?.user?.email);
  const canGenerateImg = isAdmin || (data?.user?.images_restantes > 0);
  const canGenerateVid = isAdmin || (data?.user?.videos_restantes > 0);
  
  async function generateImage() {
    if (!imgPrompt.trim()) return;
    imgLoading = true;
    imgError = null;
    imgPreviewUrl = null;
    imgValidatedUrl = null;
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imgPrompt })
      });
      const result = await res.json();
      
      if (!res.ok) {
        imgError = result.error || 'Erreur de génération';
        imgLoading = false;
        return;
      }
      
      imgPreviewUrl = result.url;
      imgGenerationId = result.id;
    } catch (e) {
      imgError = e.message;
    }
    imgLoading = false;
  }
  
  async function validateImage() {
    if (!imgGenerationId) return;
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: imgGenerationId, action: 'validate' })
      });
      const result = await res.json();
      
      if (result.success) {
        imgValidatedUrl = imgPreviewUrl;
        imgPreviewUrl = null;
        imgGenerationId = null;
      } else {
        imgError = result.error || 'Erreur lors de la validation';
      }
    } catch (e) {
      imgError = e.message;
    }
  }

  function rejectImage() {
    imgPreviewUrl = null;
    imgGenerationId = null;
    imgValidatedUrl = null;
    imgPrompt = '';
  }
  
  async function generateVideo() {
    if (!vidPrompt.trim()) return;
    vidLoading = true;
    vidError = null;
    vidPreviewUrl = null;
    vidValidatedUrl = null;
    if (vidInterval) clearInterval(vidInterval);
    
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: vidPrompt })
      });
      const result = await res.json();
      
      if (!res.ok) {
        vidError = result.error || 'Erreur de génération';
        vidLoading = false;
        return;
      }
      
      vidReplicateId = result.replicateId;
      vidGenerationId = result.id;
      
      vidInterval = setInterval(async () => {
        try {
          const checkRes = await fetch('/api/check-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replicateId: vidReplicateId, genId: vidGenerationId })
          });
          const check = await checkRes.json();
          
          if (check.status === 'succeeded') {
            clearInterval(vidInterval);
            vidInterval = null;
            vidPreviewUrl = check.url;
            vidLoading = false;
          } else if (check.status === 'failed') {
            clearInterval(vidInterval);
            vidInterval = null;
            vidError = check.error || 'Génération échouée';
            vidLoading = false;
          }
        } catch (e) {}
      }, 4000);
      
    } catch (e) {
      vidError = e.message;
      vidLoading = false;
    }
  }
  
  async function validateVideo() {
    if (!vidGenerationId) return;
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vidGenerationId, action: 'validate', type: 'video' })
      });
      const result = await res.json();
      
      if (result.success) {
        vidValidatedUrl = vidPreviewUrl;
        vidPreviewUrl = null;
        vidGenerationId = null;
      } else {
        vidError = result.error || 'Erreur lors de la validation';
      }
    } catch (e) {
      vidError = e.message;
    }
  }

  function rejectVideo() {
    if (vidInterval) clearInterval(vidInterval);
    vidInterval = null;
    vidPreviewUrl = null;
    vidGenerationId = null;
    vidValidatedUrl = null;
    vidPrompt = '';
    vidReplicateId = null;
  }
  
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => imageBase64 = e.target.result;
      reader.readAsDataURL(file);
    }
  }
  
  async function generateLipsync() {
    if (!imageBase64 || !audioUrl) return;
    
    lipLoading = true;
    lipError = null;
    lipPreviewUrl = null;
    
    try {
      const res = await fetch('/api/lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, audio: audioUrl })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        lipPreviewUrl = data.url;
      } else {
        lipError = data.error || 'Erreur de génération';
      }
    } catch (e) {
      lipError = e.message;
    }
    
    lipLoading = false;
  }
  
  function resetLipsync() {
    imageBase64 = '';
    audioUrl = '';
    lipPreviewUrl = null;
    lipError = null;
  }
</script>

<svelte:head>
  <title>Studio — ClipLumia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<main class="page">
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">ClipLumia</a>
      <a href="/" class="nav-link">Retour à l'accueil</a>
    </div>
  </nav>

  <div class="studio-container">
    <!-- HERO TYPOGRAPHIQUE MASSIF -->
    <header class="studio-header">
      <h1 class="studio-title or-chrome-text">STUDIO IA</h1>
      <p class="studio-subtitle">Génère. Valide. Zéro gaspillage.</p>
      
      <!-- BADGES MODÈLES -->
      <div class="model-badges">
        <span class="badge">FLUX.1</span>
        <span class="badge">MINIMAX</span>
        <span class="badge">SADTALKER</span>
        <span class="badge">XTTS-V2</span>
        <span class="badge">LLAMA-3</span>
      </div>
      
      <!-- COMPTEURS CRÉDITS -->
      <div class="credits">
        <span class="credit-pill">Images : {data?.user?.images_restantes || 0}</span>
        <span class="credit-pill">Vidéos : {data?.user?.videos_restantes || 0}</span>
      </div>
    </header>

    <!-- SECTION IMAGES (EMPILÉE) -->
    <section class="studio-section glass-card">
      <h2 class="section-title or-chrome-text">IMAGES</h2>
      
      {#if !canGenerateImg}
        <div class="alert">Forfait images épuisé. <a href="/#tarifs">Augmenter mon forfait</a></div>
      {:else}
        <div class="form">
          <label>Description de l'image</label>
          <textarea bind:value={imgPrompt} placeholder="Un portrait professionnel d'une femme dans un bureau moderne, éclairage doré..." rows="4"></textarea>
          <button class="btn-generate or-chrome-btn" on:click={generateImage} disabled={imgLoading}>
            {imgLoading ? 'Génération en cours...' : 'GÉNÉRER L\'IMAGE'}
          </button>
        </div>
      {/if}

      {#if imgError}
        <p class="error">{imgError}</p>
      {/if}

      {#if imgPreviewUrl && !imgValidatedUrl}
        <div class="preview-box">
          <span class="preview-badge">APERÇU</span>
          <div class="preview-media">
            <img src={imgPreviewUrl} alt="Aperçu" />
            <div class="watermark">CLIPLUMIA · PREVIEW</div>
          </div>
          <p class="preview-info">Cette image contient un filigrane. Validez pour obtenir la version HD.</p>
          <div class="actions">
            <button class="btn-reject" on:click={rejectImage}>REJETER (0€)</button>
            <button class="btn-validate or-chrome-btn" on:click={validateImage}>J'AIME (1 FORFAIT)</button>
          </div>
        </div>
      {/if}

      {#if imgValidatedUrl}
        <div class="result-box">
          <span class="result-badge">IMAGE VALIDÉE</span>
          <img src={imgValidatedUrl} alt="Résultat" />
          <button class="btn-secondary" on:click={() => { imgValidatedUrl = null; imgPrompt = ''; }}>Nouvelle image</button>
        </div>
      {/if}
    </section>

    <!-- SECTION VIDÉOS (EMPILÉE) -->
    <section class="studio-section glass-card">
      <h2 class="section-title or-chrome-text">VIDÉOS</h2>
      
      {#if !canGenerateVid}
        <div class="alert">Forfait vidéos épuisé. <a href="/#tarifs">Augmenter mon forfait</a></div>
      {:else}
        <div class="form">
          <label>Description de la vidéo</label>
          <textarea bind:value={vidPrompt} placeholder="Une femme marchant dans une rue parisienne au crépuscule..." rows="4"></textarea>
          <p class="hint">Durée estimée : 5 à 6 secondes · Génération : 30 à 60 secondes</p>
          <button class="btn-generate or-chrome-btn" on:click={generateVideo} disabled={vidLoading}>
            {vidLoading ? 'Génération en cours...' : 'GÉNÉRER LA VIDÉO'}
          </button>
        </div>
      {/if}

      {#if vidError}
        <p class="error">{vidError}</p>
      {/if}

      {#if vidLoading && !vidPreviewUrl}
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Génération en cours... Ne quittez pas cette page.</p>
        </div>
      {/if}

      {#if vidPreviewUrl && !vidValidatedUrl}
        <div class="preview-box">
          <span class="preview-badge">APERÇU</span>
          <div class="preview-media">
            <video src={vidPreviewUrl} controls loop muted playsinline></video>
            <div class="watermark">CLIPLUMIA · PREVIEW</div>
          </div>
          <p class="preview-info">Cette vidéo contient un filigrane. Validez pour obtenir la version HD.</p>
          <div class="actions">
            <button class="btn-reject" on:click={rejectVideo}>REJETER (0€)</button>
            <button class="btn-validate or-chrome-btn" on:click={validateVideo}>J'AIME (1 FORFAIT)</button>
          </div>
        </div>
      {/if}

      {#if vidValidatedUrl}
        <div class="result-box">
          <span class="result-badge">VIDÉO VALIDÉE</span>
          <video src={vidValidatedUrl} controls loop playsinline></video>
          <button class="btn-secondary" on:click={() => { vidValidatedUrl = null; vidPrompt = ''; }}>Nouvelle vidéo</button>
        </div>
      {/if}
    </section>

    <!-- SECTION LIPSYNC (EMPILÉE) -->
    <section class="studio-section glass-card">
      <h2 class="section-title or-chrome-text">LIPSYNC</h2>
      
      <div class="form">
        <label>1. Photo du visage</label>
        <input type="file" accept="image/*" on:change={handleImageUpload} />
        
        {#if imageBase64}
          <div class="upload-preview">
            <img src={imageBase64} alt="Upload" />
          </div>
        {/if}

        <label>2. URL de l'audio</label>
        <input type="text" bind:value={audioUrl} placeholder="https://..." />
        
        <button class="btn-generate or-chrome-btn" on:click={generateLipsync} disabled={lipLoading || !imageBase64 || !audioUrl}>
          {lipLoading ? 'Synchronisation...' : 'GÉNÉRER LE LIPSYNC'}
        </button>
      </div>

      {#if lipError}
        <p class="error">{lipError}</p>
      {/if}

      {#if lipPreviewUrl}
        <div class="result-box">
          <span class="result-badge">LIPSYNC GÉNÉRÉ</span>
          <video src={lipPreviewUrl} controls loop playsinline></video>
          <button class="btn-secondary" on:click={resetLipsync}>Nouveau lipsync</button>
        </div>
      {/if}
    </section>
  </div>
</main>

<style>
  /* === VARIABLES GLOBALES OR CHROME & VIOLET PROFOND === */
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background: #0f0518; /* Violet très sombre */
    color: #e0e0e0;
    -webkit-font-smoothing: antialiased;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }

  /* === EFFET OR CHROME 3D MASSIF === */
  .or-chrome-text {
    background: linear-gradient(to bottom, 
      #fff8dc 0%, 
      #d4af37 40%, 
      #aa7c11 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 2px 4px rgba(212, 175, 55, 0.4));
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .or-chrome-btn {
    background: linear-gradient(135deg, 
      #fff8dc 0%, 
      #d4af37 50%, 
      #aa7c11 100%);
    color: #0f0518;
    font-weight: 800;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4);
    transition: transform 0.1s ease, box-shadow 0.2s ease;
  }

  .or-chrome-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
  }

  .or-chrome-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
  }

  /* === FOND GLOBAL === */
  .page {
    background: 
      radial-gradient(ellipse at 20% 0%, rgba(90, 54, 150, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(60, 30, 100, 0.1) 0%, transparent 50%),
      #0f0518;
    min-height: 100vh;
    padding-bottom: 80px;
  }

  /* === NAVIGATION === */
  .nav {
    background: rgba(15, 5, 24, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-inner {
    max-width: 1000px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.3s;
  }

  .nav-link:hover {
    color: #FCF6BA;
  }

  /* === CONTENEUR PRINCIPAL === */
  .studio-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 24px;
  }

  /* === HERO HEADER === */
  .studio-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .studio-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 1.1;
    margin: 0 0 16px 0;
  }

  .studio-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 32px 0;
  }

  .model-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .badge {
    padding: 8px 20px;
    border-radius: 100px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    background: rgba(212, 175, 55, 0.08);
    color: #d4af37;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .credits {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .credit-pill {
    background: rgba(212, 175, 55, 0.12);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #FCF6BA;
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  /* === CARTES GLASSMORPHISM VIOLET === */
  .glass-card {
    background: rgba(30, 15, 45, 0.6);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 24px;
    padding: 40px;
    margin-bottom: 40px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    margin: 0 0 32px 0;
    text-align: center;
  }

  /* === FORMULAIRES === */
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form label {
    font-size: 0.95rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
  }

  textarea, input[type="text"] {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-bottom: 2px solid rgba(212, 175, 55, 0.5);
    border-radius: 16px;
    padding: 16px;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
    outline: none;
    transition: all 0.3s;
  }

  textarea:focus, input[type="text"]:focus {
    border-color: rgba(212, 175, 55, 0.8);
    background: rgba(0, 0, 0, 0.4);
  }

  textarea::placeholder, input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  input[type="file"] {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    border: 1px dashed rgba(212, 175, 55, 0.3);
  }

  .hint {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.4);
    margin: -8px 0 0 0;
  }

  /* === BOUTONS D'ACTION CONCEPT === */
  .btn-generate {
    width: 100%;
    padding: 1.2rem;
    border: none;
    border-radius: 16px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 8px;
  }

  .btn-generate:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .btn-validate {
    border: 2px solid #d4af37;
    color: #0f0518;
    padding: 1rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 800;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .btn-validate:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  .btn-reject {
    background: transparent;
    border: 2px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    padding: 1rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .btn-reject:hover {
    border-color: #d4af37;
    background: rgba(212, 175, 55, 0.1);
  }

  .btn-secondary {
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    padding: 12px 24px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
    margin-top: 16px;
  }

  .btn-secondary:hover {
    background: rgba(212, 175, 55, 0.1);
    border-color: #d4af37;
  }

  /* === ALERTES ET ERREURS === */
  .alert {
    background: rgba(212, 175, 55, 0.1);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #FCF6BA;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
  }

  .alert a {
    color: #fff;
    text-decoration: underline;
  }

  .error {
    color: #ff6b6b;
    font-size: 0.95rem;
    margin: 16px 0 0 0;
    text-align: center;
  }

  /* === PREVIEWS ET RÉSULTATS === */
  .preview-box, .result-box {
    margin-top: 40px;
    text-align: center;
  }

  .preview-badge, .result-badge {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .preview-badge {
    background: rgba(212, 175, 55, 0.15);
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #FCF6BA;
  }

  .result-badge {
    background: rgba(45, 138, 78, 0.15);
    border: 1px solid rgba(60, 179, 113, 0.4);
    color: #3cb371;
  }

  .preview-media {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.2);
    display: inline-block;
    max-width: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  .preview-media img, .preview-media video, .result-box video, .result-box img {
    max-width: 100%;
    display: block;
    border-radius: 16px;
  }

  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    color: rgba(212, 175, 55, 0.8);
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: 4px;
    text-shadow: 0 0 20px rgba(0,0,0,0.9);
    border: 2px solid rgba(212, 175, 55, 0.6);
    padding: 10px 24px;
    background: rgba(15, 5, 24, 0.7);
    pointer-events: none;
    white-space: nowrap;
  }

  .preview-info {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 20px 0;
  }

  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 24px;
  }

  /* === LOADING STATE === */
  .loading-state {
    text-align: center;
    padding: 60px 20px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(212, 175, 55, 0.2);
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .upload-preview {
    margin: 8px 0;
  }

  .upload-preview img {
    max-width: 200px;
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    .glass-card {
      padding: 24px;
      border-radius: 20px;
    }
    
    .studio-title {
      font-size: clamp(2.5rem, 10vw, 4rem);
    }
    
    .section-title {
      font-size: 1.6rem;
    }
    
    .actions {
      flex-direction: column;
    }
    
    .btn-validate, .btn-reject {
      width: 100%;
    }
    
    .model-badges {
      gap: 8px;
    }
    
    .badge {
      padding: 6px 14px;
      font-size: 0.75rem;
    }
  }
</style>
