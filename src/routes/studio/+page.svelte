<script>
  export let data;
  
  // === LOGIQUE EXISTANTE INTACTE ===
  let activeTab = 'images';
  
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

<div class="studio-deevid">
  
  <!-- SIDEBAR GAUCHE -->
  <aside class="sidebar-cl">
    <div class="logo-cl chrome-text">ClipLumia</div>
    
    <div class="nav-item" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>Images IA</div>
    <div class="nav-item" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>Vidéos IA</div>
    <div class="nav-item" class:active={activeTab === 'lipsync'} on:click={() => activeTab = 'lipsync'}>Lipsync</div>
    <div class="nav-item" class:active={activeTab === 'voice'} on:click={() => activeTab = 'voice'}>Voix IA</div>
    <div class="nav-item" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>Chat IA</div>
  </aside>

  <!-- CENTRE : STUDIO DYNAMIQUE -->
  <main class="studio-center">
    <div class="header-studio">
      <h2 class="chrome-text">
        {activeTab === 'images' ? 'Générateur d\'Images IA' : 
         activeTab === 'video' ? 'Générateur de Vidéos IA' :
         activeTab === 'lipsync' ? 'Studio Lipsync' :
         activeTab === 'voice' ? 'Synthèse Vocale' : 'Chat IA'}
      </h2>
      <div class="credits-badge">Crédits : {data?.user?.images_restantes || 0}</div>
    </div>

    <!-- SECTION IMAGES -->
    {#if activeTab === 'images'}
      <div class="input-card">
        <textarea bind:value={imgPrompt} placeholder="Décris ton image en détail... Une femme élégante dans un bureau moderne, éclairage doré..."></textarea>
        
        <div class="options-row">
          <select>
            <option value="black-forest-labs/flux-schnell">Modèle : FLUX.1 Schnell</option>
            <option value="stability-ai/sdxl">Modèle : SDXL Turbo</option>
          </select>
          <select>
            <option>Ratio : 1:1 (Carré)</option>
            <option>Ratio : 16:9 (Paysage)</option>
            <option>Ratio : 9:16 (Portrait)</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateImage} disabled={imgLoading || !canGenerateImg}>
        {imgLoading ? 'Génération...' : 'CRÉER L\'IMAGE'}
      </button>
    {/if}

    <!-- SECTION VIDÉO -->
    {#if activeTab === 'video'}
      <div class="input-card">
        <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo... Un drone survolant une ville futuriste au crépuscule..."></textarea>
        
        <div class="options-row">
          <select>
            <option value="minimax/video-01">Modèle : Minimax Video-01 (6s)</option>
            <option value="luma/dream-machine">Modèle : Dream Machine</option>
          </select>
          <select>
            <option>Durée : 6 secondes</option>
            <option>Durée : 5 secondes</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateVideo} disabled={vidLoading || !canGenerateVid}>
        {vidLoading ? 'Génération...' : 'CRÉER LA VIDÉO'}
      </button>
    {/if}

    <!-- SECTION LIPSYNC -->
    {#if activeTab === 'lipsync'}
      <div class="input-card">
        <label style="color:rgba(255,255,255,0.6); font-size:0.8rem; margin-bottom:8px; display:block;">1. Photo du visage</label>
        <input type="file" accept="image/*" on:change={handleImageUpload} style="margin-bottom:15px;" />
        
        <label style="color:rgba(255,255,255,0.6); font-size:0.8rem; margin-bottom:8px; display:block;">2. URL Audio ou Texte</label>
        <input type="text" bind:value={audioUrl} placeholder="https://..." style="width:100%; background:#1a0b2e; border:1px solid rgba(212,175,55,0.3); color:#fff; padding:8px; border-radius:6px; margin-bottom:15px;" />
        
        <select style="background:#1a0b2e; border:1px solid rgba(212,175,55,0.3); color:#fff; padding:8px; border-radius:6px; width:100%;">
          <option value="cjwbw/sadtalker">Modèle : SadTalker v1</option>
          <option value="another/model">Modèle : Wav2Lip</option>
        </select>
      </div>
      <button class="chrome-btn create-btn" on:click={generateLipsync} disabled={lipLoading || !imageBase64 || !audioUrl}>
        {lipLoading ? 'Synchronisation...' : 'CRÉER LE LIPSYNC'}
      </button>
    {/if}

    <!-- SECTION VOIX -->
    {#if activeTab === 'voice'}
      <div class="input-card">
        <textarea placeholder="Écris le texte à vocaliser..."></textarea>
        
        <div class="options-row">
          <select>
            <option value="lucataco/xtts-v2">Modèle : XTTS-V2</option>
            <option value="another/voice-model">Modèle : Bark</option>
          </select>
          <select>
            <option>Voix : Femme FR</option>
            <option>Voix : Homme FR</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" disabled>
        CRÉER LA VOIX
      </button>
    {/if}

    <!-- SECTION CHAT -->
    {#if activeTab === 'chat'}
      <div class="input-card">
        <textarea placeholder="Pose ta question ou donne tes instructions..."></textarea>
        
        <div class="options-row">
          <select>
            <option value="meta/meta-llama-3-8b-instruct">Modèle : Llama-3-8B-Instruct</option>
            <option value="mistralai/mistral-7b">Modèle : Mistral-7B</option>
          </select>
          <select>
            <option>Ton : Professionnel</option>
            <option>Ton : Créatif</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" disabled>
        ENVOYER
      </button>
    {/if}

    <!-- ZONE PREVIEW UNIVERSELLE -->
    {#if imgPreviewUrl || vidPreviewUrl || lipPreviewUrl}
      <div class="preview-universal">
        <div class="preview-label">APERÇU DU RÉSULTAT</div>
        
        {#if imgPreviewUrl}
          <div class="preview-media"><img src={imgPreviewUrl} alt="Preview" /></div>
        {:else if vidPreviewUrl}
          <div class="preview-media"><video src={vidPreviewUrl} controls loop muted playsinline></video></div>
        {:else if lipPreviewUrl}
          <div class="preview-media"><video src={lipPreviewUrl} controls loop playsinline></video></div>
        {/if}

        <div class="watermark-overlay">CLIPLUMIA · PREVIEW</div>

        <div class="action-buttons">
          <button class="btn-reject" on:click={activeTab === 'images' ? rejectImage : activeTab === 'video' ? rejectVideo : resetLipsync}>
            ❌ Rejeter (0€)
          </button>
          <button class="btn-validate" on:click={activeTab === 'images' ? validateImage : activeTab === 'video' ? validateVideo : null}>
            ✅ J'aime (1 Forfait)
          </button>
        </div>
      </div>
    {/if}
  </main>

  <!-- DROITE : INSPIRATIONS & MODÈLES -->
  <aside class="preview-side">
    <div class="preview-label">INSPIRATIONS</div>
    
    <div class="examples-grid">
      <div class="example-thumb">Ex 1</div>
      <div class="example-thumb">Ex 2</div>
      <div class="example-thumb">Ex 3</div>
      <div class="example-thumb">Ex 4</div>
    </div>

    <div class="model-info">
      <div class="model-badge">MODÈLE ACTIF</div>
      <div class="model-name">
        {activeTab === 'images' ? 'FLUX.1 Schnell' : 
         activeTab === 'video' ? 'Minimax Video-01' :
         activeTab === 'lipsync' ? 'SadTalker' :
         activeTab === 'voice' ? 'XTTS-V2' : 'Llama-3'}
      </div>
      <div class="model-desc">Technologie Replicate haute performance</div>
    </div>
  </aside>

</div>

<style>
  /* === STRUCTURE DEEVID AI === */
  .studio-deevid {
    display: flex;
    gap: 20px;
    height: calc(100vh - 80px);
    padding: 20px;
    box-sizing: border-box;
  }

  /* === SIDEBAR === */
  .sidebar-cl {
    width: 240px;
    background: #2d1b4e;
    border-radius: 16px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }

  .logo-cl {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    text-align: center;
    margin-bottom: 30px;
  }

  .nav-item {
    padding: 14px 16px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    font-weight: 500;
  }

  .nav-item:hover { background: rgba(212, 175, 55, 0.05); color: #fff; }
  
  .nav-item.active {
    background: rgba(212, 175, 55, 0.1);
    color: #d4af37;
    border: 1px solid rgba(212, 175, 55, 0.2);
    font-weight: 600;
  }

  /* === CENTRE === */
  .studio-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 10px;
  }

  .header-studio {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .credits-badge {
    font-size: 0.8rem;
    color: #d4af37;
    background: rgba(212, 175, 55, 0.05);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    font-weight: 600;
  }

  .input-card {
    background: rgba(45, 27, 78, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 16px;
    padding: 24px;
  }

  textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    min-height: 140px;
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }

  .options-row {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  select {
    background: #1a0b2e;
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #f0f0f5;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;
  }

  .create-btn {
    width: 100%;
    padding: 18px;
    font-size: 1rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    letter-spacing: 0.05em;
  }

  /* === PREVIEW UNIVERSELLE === */
  .preview-universal {
    background: rgba(45, 27, 78, 0.4);
    border: 1px solid rgba(212, 175, 55, 0.1);
    border-radius: 16px;
    padding: 24px;
    margin-top: 20px;
    position: relative;
  }

  .preview-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 16px;
    font-weight: 700;
  }

  .preview-media {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-media img, .preview-media video {
    max-width: 100%;
    max-height: 400px;
    display: block;
  }

  .watermark-overlay {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    color: rgba(212, 175, 55, 0.3);
    font-size: 1.5rem;
    font-weight: 900;
    pointer-events: none;
    white-space: nowrap;
    border: 2px solid rgba(212, 175, 55, 0.2);
    padding: 12px 24px;
    background: rgba(10, 5, 20, 0.6);
  }

  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .btn-reject {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    transition: all 0.2s;
  }
  .btn-reject:hover { border-color: #ff4444; color: #ff4444; background: rgba(255,68,68,0.05); }

  .btn-validate {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    background: linear-gradient(135deg, #d4af37, #aa7c11);
    border: none;
    color: #1a0b2e;
    transition: all 0.2s;
  }
  .btn-validate:hover { filter: brightness(1.1); transform: translateY(-1px); }

  /* === DROITE : INSPIRATIONS === */
  .preview-side {
    width: 300px;
    background: #2d1b4e;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
  }

  .examples-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .example-thumb {
    aspect-ratio: 1;
    background: #1a0b2e;
    border-radius: 10px;
    border: 1px solid rgba(212, 175, 55, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.2);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .example-thumb:hover { border-color: #d4af37; color: #d4af37; }

  .model-info {
    background: rgba(26, 11, 46, 0.6);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(212, 175, 55, 0.1);
  }

  .model-badge {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .model-name {
    font-size: 1rem;
    color: #d4af37;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .model-desc {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
  }

  /* === OR CHROME MÉTALLIQUE RÉALISTE === */
  .chrome-text {
    background: linear-gradient(to bottom, #ffffff 0%, #f5d76e 20%, #d4af37 50%, #aa7c11 80%, #8b6508 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 1px 0px rgba(255, 255, 255, 0.4)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8));
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  .chrome-btn {
    background: linear-gradient(180deg, #ffffff 0%, #f5d76e 30%, #d4af37 50%, #aa7c11 70%, #8b6508 100%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    color: #1a0b2e;
    font-weight: 900;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 4px 15px rgba(0, 0, 0, 0.4);
    transition: all 0.2s ease;
  }
  .chrome-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4); }
  .chrome-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.5); }

  /* === MOBILE === */
  @media (max-width: 1024px) {
    .studio-deevid { flex-direction: column; height: auto; padding: 10px; }
    .sidebar-cl { width: 100%; flex-direction: row; overflow-x: auto; padding: 10px; gap: 10px; }
    .logo-cl { display: none; }
    .nav-item { white-space: nowrap; padding: 10px 16px; }
    .preview-side { width: 100%; flex-direction: row; overflow-x: auto; }
    .examples-grid { display: flex; gap: 12px; }
    .example-thumb { width: 80px; height: 80px; flex-shrink: 0; }
    .model-info { min-width: 200px; }
  }
</style>
