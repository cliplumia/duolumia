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


<div class="studio-deevid"> <!-- CETTE LIGNE EST OBLIGATOIRE -->
  

<div class="app-layout">
  
<!-- SIDEBAR GAUCHE -->
  <aside class="sidebar">
    <div class="logo-area chrome-text">ClipLumia</div>
    
    <div class="nav-item active">Images IA</div>
    <div class="nav-item">Vidéos IA</div>
    <div class="nav-item">Lipsync</div>
    <div class="nav-item">Voix IA</div>
    <div class="nav-item">Chat IA</div>
  </aside>

  <!-- CENTRE : STUDIO -->
  <main class="studio-main">
    <div class="studio-header">
      <h2 class="chrome-text">Générateur d'Images IA</h2>
      <div class="credits-display">Crédits : 0</div>
    </div>

    <div class="input-group">
      <textarea placeholder="Décris ton image en détail..."></textarea>
      
      <div class="options-row">
        <select><option>Modèle : FLUX.1 Schnell</option></select>
        <select><option>Ratio : 1:1 (Carré)</option></select>
      </div>
    </div>

    <button class="chrome-btn create-btn">CRÉER L'IMAGE</button>
  </main>

  <!-- DROITE : PREVIEW -->
  <aside class="preview-panel">
    <div style="font-size:0.8rem; color:rgba(255,255,255,0.4); text-transform:uppercase;">Aperçu</div>
    
    <div class="preview-box">
      <div style="color:rgba(255,255,255,0.3);">Ton résultat apparaîtra ici</div>
    </div>

    <div class="action-buttons">
      <button class="btn-concept btn-reject">❌ Rejeter (0€)</button>
      <button class="btn-concept btn-validate">✅ J'aime (1 Forfait)</button>
    </div>

    <div style="font-size:0.8rem; color:rgba(255,255,255,0.4); margin-top:20px;">Inspirations</div>
    <div class="examples-carousel">
      <div class="example-thumb"></div>
      <div class="example-thumb"></div>
      <div class="example-thumb"></div>
    </div>
  </aside>

</div>

<style>
  /* === COULEURS CLIP LUMIA EXACTES === */
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background: #1a0b2e; /* VIOLET PROFOND */
    color: #f0f0f5;
    overflow: hidden;
  }

  /* === OR CHROME MÉTALLIQUE (EFFET BRILLANT) === */
  .chrome-text {
    background: linear-gradient(to bottom, 
      #fff8dc 0%, 
      #d4af37 40%, 
      #aa7c11 75%, 
      #8b6508 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.6));
    font-weight: 800;
    letter-spacing: 0.05em;
  }

  .chrome-btn {
    background: linear-gradient(180deg, 
      #f9e5a8 0%, 
      #d4af37 40%, 
      #aa7c11 60%, 
      #8b6508 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    color: #1a0b2e; /* TEXTE VIOLET FONCÉ */
    font-weight: 800;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 15px rgba(212, 175, 55, 0.2);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .chrome-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

  /* === LAYOUT DEEVID AI === */
  .app-layout { display: flex; height: 100vh; width: 100vw; }

  .sidebar {
    width: 260px; 
    background: #2d1b4e; /* VIOLET MOYEN */
    border-right: 1px solid rgba(212, 175, 55, 0.2);
    padding: 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 10px;
  }

  .logo-area { 
    font-family: 'Playfair Display', serif; 
    font-size: 1.5rem; 
    margin-bottom: 30px; 
    text-align: center; 
  }

  .nav-item {
    padding: 12px 16px; 
    border-radius: 8px; 
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer; 
    transition: all 0.2s; 
    font-size: 0.9rem;
  }
  .nav-item:hover { background: rgba(212, 175, 55, 0.05); color: #fff; }
  .nav-item.active { 
    background: rgba(212, 175, 55, 0.1); 
    color: #d4af37; 
    border: 1px solid rgba(212, 175, 55, 0.2); 
    font-weight: 600; 
  }

  .studio-main {
    flex: 1; 
    background: #1a0b2e; /* VIOLET PROFOND */
    padding: 30px; 
    overflow-y: auto;
    display: flex; 
    flex-direction: column; 
    gap: 20px;
  }

  .studio-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
  }

  .credits-display {
    font-size: 0.8rem; 
    color: rgba(212, 175, 55, 0.8); 
    background: rgba(212, 175, 55, 0.05);
    padding: 6px 12px; 
    border-radius: 20px; 
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .input-group {
    background: rgba(45, 27, 78, 0.6); /* VERRE VIOLET */
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 12px; 
    padding: 20px;
  }

  textarea {
    width: 100%; 
    background: transparent; 
    border: none; 
    color: #fff;
    font-size: 1rem; 
    resize: none; 
    outline: none; 
    min-height: 120px; 
    font-family: inherit;
  }

  .options-row { display: flex; gap: 10px; margin-top: 15px; }

  select {
    background: #1a0b2e; /* VIOLET FONCÉ */
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #f0f0f5;
    padding: 8px 12px; 
    border-radius: 6px; 
    font-size: 0.85rem; 
    outline: none;
  }

  .create-btn { 
    width: 100%; 
    padding: 16px; 
    font-size: 1rem; 
    border-radius: 8px; 
    margin-top: 10px; 
  }

  .preview-panel {
    width: 400px; 
    background: #2d1b4e; /* VIOLET MOYEN */
    border-left: 1px solid rgba(212, 175, 55, 0.2);
    padding: 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 20px;
  }

  .preview-box {
    flex: 1; 
    background: #1a0b2e; /* VIOLET PROFOND */
    border-radius: 12px; 
    border: 1px solid rgba(212, 175, 55, 0.1);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-height: 300px;
  }

  .action-buttons { display: flex; gap: 10px; margin-top: auto; }

  .btn-concept {
    flex: 1; 
    padding: 12px; 
    border-radius: 8px; 
    font-weight: 700;
    font-size: 0.85rem; 
    cursor: pointer; 
    text-transform: uppercase; 
    transition: all 0.2s;
  }

  .btn-validate {
    background: linear-gradient(135deg, #d4af37, #aa7c11); 
    border: none;
    color: #1a0b2e; /* TEXTE VIOLET */
    box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
  }

  .btn-reject {
    background: transparent; 
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37; /* TEXTE OR */
  }
  .btn-reject:hover { border-color: #ff4444; color: #ff4444; }

  .examples-carousel { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; }

  .example-thumb {
    width: 80px; 
    height: 80px; 
    border-radius: 8px; 
    background: #1a0b2e;
    border: 1px solid rgba(212, 175, 55, 0.2); 
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    .app-layout { flex-direction: column; height: auto; overflow: auto; }
    .sidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 10px; }
    .preview-panel { width: 100%; height: 400px; }
  }
</style>
  
  <!-- SIDEBAR GAUCHE -->
  <aside class="sidebar">
    <div class="logo-area chrome-text">ClipLumia</div>
    
    <div class="nav-item active">Images IA</div>
    <div class="nav-item">Vidéos IA</div>
    <div class="nav-item">Lipsync</div>
    <div class="nav-item">Voix IA</div>
    <div class="nav-item">Chat IA</div>
  </aside>

  <!-- CENTRE : STUDIO -->
  <main class="studio-main">
    <div class="studio-header">
      <h2 class="chrome-text">Générateur d'Images IA</h2>
      <div class="credits-display">Crédits : 0</div>
    </div>

    <div class="input-group">
      <textarea placeholder="Décris ton image en détail..."></textarea>
      
      <div class="options-row">
        <select><option>Modèle : FLUX.1 Schnell</option></select>
        <select><option>Ratio : 1:1 (Carré)</option></select>
      </div>
    </div>

    <button class="chrome-btn create-btn">CRÉER L'IMAGE</button>
  </main>

  <!-- DROITE : PREVIEW -->
  <aside class="preview-panel">
    <div style="font-size:0.8rem; color:rgba(255,255,255,0.4); text-transform:uppercase;">Aperçu</div>
    
    <div class="preview-box">
      <div style="color:rgba(255,255,255,0.3);">Ton résultat apparaîtra ici</div>
    </div>

    <div class="action-buttons">
      <button class="btn-concept btn-reject">❌ Rejeter (0€)</button>
      <button class="btn-concept btn-validate">✅ J'aime (1 Forfait)</button>
    </div>

    <div style="font-size:0.8rem; color:rgba(255,255,255,0.4); margin-top:20px;">Inspirations</div>
    <div class="examples-carousel">
      <div class="example-thumb"></div>
      <div class="example-thumb"></div>
      <div class="example-thumb"></div>
    </div>
  </aside>
</div>

<style>
  /* === COULEURS CLIP LUMIA EXACTES === */
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    background: #1a0b2e; /* VIOLET PROFOND */
    color: #f0f0f5;
    overflow: hidden;
  }

  /* === OR CHROME MÉTALLIQUE (EFFET BRILLANT) === */
  .chrome-text {
    background: linear-gradient(to bottom, 
      #fff8dc 0%, 
      #d4af37 40%, 
      #aa7c11 75%, 
      #8b6508 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.6));
    font-weight: 800;
    letter-spacing: 0.05em;
  }

  .chrome-btn {
    background: linear-gradient(180deg, 
      #f9e5a8 0%, 
      #d4af37 40%, 
      #aa7c11 60%, 
      #8b6508 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    color: #1a0b2e; /* TEXTE VIOLET FONCÉ */
    font-weight: 800;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 4px 15px rgba(212, 175, 55, 0.2);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .chrome-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

  /* === LAYOUT DEEVID AI === */
  .app-layout { display: flex; height: 100vh; width: 100vw; }

  .sidebar {
    width: 260px; 
    background: #2d1b4e; /* VIOLET MOYEN */
    border-right: 1px solid rgba(212, 175, 55, 0.2);
    padding: 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 10px;
  }

  .logo-area { 
    font-family: 'Playfair Display', serif; 
    font-size: 1.5rem; 
    margin-bottom: 30px; 
    text-align: center; 
  }

  .nav-item {
    padding: 12px 16px; 
    border-radius: 8px; 
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer; 
    transition: all 0.2s; 
    font-size: 0.9rem;
  }
  .nav-item:hover { background: rgba(212, 175, 55, 0.05); color: #fff; }
  .nav-item.active { 
    background: rgba(212, 175, 55, 0.1); 
    color: #d4af37; 
    border: 1px solid rgba(212, 175, 55, 0.2); 
    font-weight: 600; 
  }

  .studio-main {
    flex: 1; 
    background: #1a0b2e; /* VIOLET PROFOND */
    padding: 30px; 
    overflow-y: auto;
    display: flex; 
    flex-direction: column; 
    gap: 20px;
  }

  .studio-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
  }

  .credits-display {
    font-size: 0.8rem; 
    color: rgba(212, 175, 55, 0.8); 
    background: rgba(212, 175, 55, 0.05);
    padding: 6px 12px; 
    border-radius: 20px; 
    border: 1px solid rgba(212, 175, 55, 0.2);
  }

  .input-group {
    background: rgba(45, 27, 78, 0.6); /* VERRE VIOLET */
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 12px; 
    padding: 20px;
  }

  textarea {
    width: 100%; 
    background: transparent; 
    border: none; 
    color: #fff;
    font-size: 1rem; 
    resize: none; 
    outline: none; 
    min-height: 120px; 
    font-family: inherit;
  }

  .options-row { display: flex; gap: 10px; margin-top: 15px; }

  select {
    background: #1a0b2e; /* VIOLET FONCÉ */
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #f0f0f5;
    padding: 8px 12px; 
    border-radius: 6px; 
    font-size: 0.85rem; 
    outline: none;
  }

  .create-btn { 
    width: 100%; 
    padding: 16px; 
    font-size: 1rem; 
    border-radius: 8px; 
    margin-top: 10px; 
  }

  .preview-panel {
    width: 400px; 
    background: #2d1b4e; /* VIOLET MOYEN */
    border-left: 1px solid rgba(212, 175, 55, 0.2);
    padding: 20px; 
    display: flex; 
    flex-direction: column; 
    gap: 20px;
  }

  .preview-box {
    flex: 1; 
    background: #1a0b2e; /* VIOLET PROFOND */
    border-radius: 12px; 
    border: 1px solid rgba(212, 175, 55, 0.1);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-height: 300px;
  }

  .action-buttons { display: flex; gap: 10px; margin-top: auto; }

  .btn-concept {
    flex: 1; 
    padding: 12px; 
    border-radius: 8px; 
    font-weight: 700;
    font-size: 0.85rem; 
    cursor: pointer; 
    text-transform: uppercase; 
    transition: all 0.2s;
  }

  .btn-validate {
    background: linear-gradient(135deg, #d4af37, #aa7c11); 
    border: none;
    color: #1a0b2e; /* TEXTE VIOLET */
    box-shadow: 0 4px 10px rgba(212, 175, 55, 0.2);
  }

  .btn-reject {
    background: transparent; 
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37; /* TEXTE OR */
  }
  .btn-reject:hover { border-color: #ff4444; color: #ff4444; }

  .examples-carousel { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; }

  .example-thumb {
    width: 80px; 
    height: 80px; 
    border-radius: 8px; 
    background: #1a0b2e;
    border: 1px solid rgba(212, 175, 55, 0.2); 
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    .app-layout { flex-direction: column; height: auto; overflow: auto; }
    .sidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 10px; }
    .preview-panel { width: 100%; height: 400px; }
  }

</style>
