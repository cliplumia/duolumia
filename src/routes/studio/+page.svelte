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
  let imgFormat = '1:1';
  let imgStyle = 'realiste';
  
  let vidPrompt = '';
  let vidLoading = false;
  let vidPreviewUrl = null;
  let vidValidatedUrl = null;
  let vidGenerationId = null;
  let vidReplicateId = null;
  let vidInterval = null;
  let vidError = null;
  let vidFormat = '16:9';
  let vidStyle = 'cinematique';
  
  let imageBase64 = '';
  let audioUrl = '';
  let lipLoading = false;
  let lipPreviewUrl = null;
  let lipError = null;
  let lipAudioSource = 'upload';
  let lipExpression = 'neutre';
  let lipType = 'parole';
  
  let voiceText = '';
  let voiceLoading = false;
  let voiceAudioUrl = null;
  let voiceLang = 'FR';
  let voiceType = 'femme';
  let voiceStyle = 'professionnel';
  let voiceEmotion = 'neutre';
  let voiceSpeed = 'normal';
  
  let chatPrompt = '';
  let chatLoading = false;
  let chatResponse = '';
  let chatRole = 'assistant';
  let chatTone = 'pro';
  let chatFormat = 'texte';
  let chatLength = 'standard';
  
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
        body: JSON.stringify({ 
          prompt: imgPrompt,
          format: imgFormat,
          style: imgStyle
        })
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
        body: JSON.stringify({ 
          prompt: vidPrompt,
          format: vidFormat,
          style: vidStyle
        })
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
        body: JSON.stringify({ 
          image: imageBase64, 
          audio: audioUrl,
          expression: lipExpression,
          type: lipType
        })
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

  async function generateVoice() {
    if (!voiceText.trim()) return;
    voiceLoading = true;
    voiceAudioUrl = null;
    
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: voiceText,
          lang: voiceLang,
          type: voiceType,
          style: voiceStyle,
          emotion: voiceEmotion,
          speed: voiceSpeed
        })
      });
      const result = await res.json();
      
      if (res.ok) {
        voiceAudioUrl = result.audioUrl;
      } else {
        alert('Erreur: ' + (result.error || 'Impossible de générer'));
      }
    } catch (e) {
      alert('Erreur réseau: ' + e.message);
    }
    voiceLoading = false;
  }

  async function generateChat() {
    if (!chatPrompt.trim()) return;
    chatLoading = true;
    chatResponse = '';
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: chatPrompt,
          role: chatRole,
          tone: chatTone,
          format: chatFormat,
          length: chatLength
        })
      });
      const result = await res.json();
      
      if (res.ok) {
        chatResponse = result.response;
      } else {
        chatResponse = 'Erreur: ' + (result.error || 'Impossible de générer');
      }
    } catch (e) {
      chatResponse = 'Erreur réseau: ' + e.message;
    }
    chatLoading = false;
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
    
    <div class="nav-item" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>🖼️ Images IA</div>
    <div class="nav-item" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>🎬 Vidéos IA</div>
    <div class="nav-item" class:active={activeTab === 'lipsync'} on:click={() => activeTab = 'lipsync'}>👄 Lipsync</div>
    <div class="nav-item" class:active={activeTab === 'voice'} on:click={() => activeTab = 'voice'}>🎤 Voix IA</div>
    <div class="nav-item" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>💬 Chat IA</div>
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
      <div class="credits-badge">Forfait : {data?.user?.images_restantes || 0}</div>
    </div>

    <!-- SECTION IMAGES -->
    {#if activeTab === 'images'}
      <div class="input-card">
        <textarea bind:value={imgPrompt} placeholder="Décris ton image en détail... Une femme élégante dans un bureau moderne, éclairage doré..."></textarea>
        
        <div class="options-row">
          <select bind:value={imgFormat}>
            <option value="1:1">Format : 1:1 (Carré)</option>
            <option value="16:9">Format : 16:9 (Paysage)</option>
            <option value="9:16">Format : 9:16 (Portrait)</option>
            <option value="tiktok">Format : TikTok</option>
            <option value="4:5">Format : 4:5 (Instagram)</option>
          </select>
          <select bind:value={imgStyle}>
            <option value="realiste">Style : Réaliste</option>
            <option value="cinematique">Style : Cinématique</option>
            <option value="3d">Style : 3D Render</option>
            <option value="anime">Style : Anime</option>
            <option value="illustration">Style : Illustration</option>
            <option value="photographique">Style : Photographique</option>
            <option value="noirblanc">Style : Noir & Blanc</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateImage} disabled={imgLoading || !canGenerateImg}>
        {imgLoading ? '⏳ Génération...' : '✨ CRÉER L\'IMAGE'}
      </button>
    {/if}

    <!-- SECTION VIDÉO -->
    {#if activeTab === 'video'}
      <div class="input-card">
        <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo... Un drone survolant une ville futuriste au crépuscule..."></textarea>
        
        <div class="options-row">
          <select bind:value={vidFormat}>
            <option value="16:9">Format : 16:9</option>
            <option value="tiktok">Format : TikTok</option>
            <option value="1:1">Format : 1:1</option>
          </select>
          <select bind:value={vidStyle}>
            <option value="cinematique">Style : Cinématique</option>
            <option value="dynamique">Style : Dynamique</option>
            <option value="lent">Style : Lent/Slow</option>
            <option value="timelapse">Style : Time-lapse</option>
            <option value="vlog">Style : Vlog</option>
            <option value="publicitaire">Style : Publicitaire</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateVideo} disabled={vidLoading || !canGenerateVid}>
        {vidLoading ? '⏳ Génération...' : '🎬 CRÉER LA VIDÉO'}
      </button>
    {/if}

    <!-- SECTION LIPSYNC -->
    {#if activeTab === 'lipsync'}
      <div class="input-card">
        <label>1. Photo du visage</label>
        <input type="file" accept="image/*" on:change={handleImageUpload} />
        
        <label>2. Source Audio</label>
        <select bind:value={lipAudioSource}>
          <option value="upload">Upload fichier audio</option>
          <option value="tts">Texte à vocaliser</option>
          <option value="url">URL audio externe</option>
        </select>
        
        <label>3. URL Audio ou Texte</label>
        <input type="text" bind:value={audioUrl} placeholder="https://..." />
        
        <label>4. Expression Faciale</label>
        <select bind:value={lipExpression}>
          <option value="neutre">Neutre (naturelle)</option>
          <option value="souriant">Souriant (joyeux)</option>
          <option value="serieux">Sérieux (professionnel)</option>
          <option value="intense">Émotion intense</option>
          <option value="precise">Synchronisation précise</option>
        </select>
        
        <label>5. Type de Performance</label>
        <select bind:value={lipType}>
          <option value="parole">Parole seule (discours)</option>
          <option value="chant">Chant (musique)</option>
          <option value="performance">Performance artistique</option>
          <option value="presentation">Présentation pro</option>
        </select>
      </div>
      <button class="chrome-btn create-btn" on:click={generateLipsync} disabled={lipLoading || !imageBase64 || !audioUrl}>
        {lipLoading ? '⏳ Synchronisation...' : '👄 CRÉER LE LIPSYNC'}
      </button>
    {/if}

    <!-- SECTION VOIX -->
    {#if activeTab === 'voice'}
      <div class="input-card">
        <textarea bind:value={voiceText} placeholder="Écris le texte à vocaliser..."></textarea>
        
        <div class="options-row">
          <select bind:value={voiceLang}>
            <option value="FR">Langue : Français</option>
            <option value="EN">Langue : Anglais</option>
          </select>
          <select bind:value={voiceType}>
            <option value="femme">Type : Femme</option>
            <option value="homme">Type : Homme</option>
            <option value="enfant">Type : Enfant</option>
            <option value="mature">Type : Voix mature</option>
          </select>
        </div>
        
        <div class="options-row">
          <select bind:value={voiceStyle}>
            <option value="professionnel">Style : Professionnel</option>
            <option value="chaleureux">Style : Chaleureux</option>
            <option value="dynamique">Style : Dynamique</option>
            <option value="calme">Style : Calme</option>
            <option value="narratif">Style : Narratif</option>
            <option value="publicitaire">Style : Publicitaire</option>
          </select>
          <select bind:value={voiceEmotion}>
            <option value="neutre">Émotion : Neutre</option>
            <option value="joyeux">Émotion : Joyeux</option>
            <option value="serieux">Émotion : Sérieux</option>
            <option value="dramatique">Émotion : Dramatique</option>
            <option value="enthousiaste">Émotion : Enthousiaste</option>
          </select>
        </div>
        
        <div class="options-row">
          <select bind:value={voiceSpeed}>
            <option value="lent">Vitesse : Lent</option>
            <option value="normal">Vitesse : Normal</option>
            <option value="rapide">Vitesse : Rapide</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateVoice} disabled={voiceLoading}>
        {voiceLoading ? '⏳ Génération...' : '🎤 CRÉER LA VOIX'}
      </button>
    {/if}

    <!-- SECTION CHAT -->
    {#if activeTab === 'chat'}
      <div class="input-card">
        <textarea bind:value={chatPrompt} placeholder="Pose ta question ou donne tes instructions..."></textarea>
        
        <div class="options-row">
          <select bind:value={chatRole}>
            <option value="assistant">Rôle : Assistant Général</option>
            <option value="copywriter">Rôle : Copywriter</option>
            <option value="scenariste">Rôle : Scénariste</option>
            <option value="coach">Rôle : Coach</option>
            <option value="traducteur">Rôle : Traducteur</option>
            <option value="expert">Rôle : Expert Tech</option>
          </select>
          <select bind:value={chatTone}>
            <option value="pro">Ton : Professionnel</option>
            <option value="creatif">Ton : Créatif</option>
            <option value="direct">Ton : Direct</option>
            <option value="pedagogique">Ton : Pédagogique</option>
            <option value="humoristique">Ton : Humoristique</option>
          </select>
        </div>
        
        <div class="options-row">
          <select bind:value={chatFormat}>
            <option value="texte">Format : Texte simple</option>
            <option value="liste">Format : Liste à puces</option>
            <option value="etapes">Format : Étapes détaillées</option>
            <option value="tableau">Format : Tableau</option>
          </select>
          <select bind:value={chatLength}>
            <option value="resume">Longueur : Résumé</option>
            <option value="standard">Longueur : Standard</option>
            <option value="detaille">Longueur : Détaillé</option>
          </select>
        </div>
      </div>
      <button class="chrome-btn create-btn" on:click={generateChat} disabled={chatLoading}>
        {chatLoading ? '⏳ Réflexion...' : '💬 ENVOYER'}
      </button>
      
      {#if chatResponse}
        <div class="chat-response">
          <div class="chat-bubble ai">{chatResponse}</div>
        </div>
      {/if}
    {/if}

    <!-- ZONE PREVIEW UNIVERSELLE -->
    {#if imgPreviewUrl || vidPreviewUrl || lipPreviewUrl || voiceAudioUrl}
      <div class="preview-universal">
        <div class="preview-label">APERÇU DU RÉSULTAT</div>
        
        {#if imgPreviewUrl}
          <div class="preview-media"><img src={imgPreviewUrl} alt="Preview" /></div>
        {:else if vidPreviewUrl}
          <div class="preview-media"><video src={vidPreviewUrl} controls loop muted playsinline></video></div>
        {:else if lipPreviewUrl}
          <div class="preview-media"><video src={lipPreviewUrl} controls loop playsinline></video></div>
        {:else if voiceAudioUrl}
          <div class="preview-media audio-player"><audio src={voiceAudioUrl} controls></audio></div>
        {/if}

        <div class="watermark-overlay">CLIPLUMIA · PREVIEW</div>
      </div>
    {/if}

    <!-- BOUTONS J'AIME / REJETER TOUJOURS VISIBLES -->
    <div class="action-buttons">
      <button class="btn-reject" on:click={activeTab === 'images' ? rejectImage : activeTab === 'video' ? rejectVideo : activeTab === 'lipsync' ? resetLipsync : null}>
        ❌ Rejeter (0€)
      </button>
      <button class="btn-validate" on:click={activeTab === 'images' ? validateImage : activeTab === 'video' ? validateVideo : null}>
        ✅ J'aime (1 Forfait)
      </button>
    </div>
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
      <div class="model-desc">Technologie IA haute performance</div>
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
    width: 260px;
    background: #2d1b4e;
    border-radius: 16px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
  }

  .logo-cl {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 30px;
  }

  .nav-item {
    padding: 16px 18px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .nav-item:hover { background: rgba(212, 175, 55, 0.08); color: #fff; }
  
  .nav-item.active {
    background: rgba(212, 175, 55, 0.15);
    color: #f5d76e;
    border: 1px solid rgba(212, 175, 55, 0.3);
    font-weight: 700;
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
    font-size: 0.9rem;
    color: #f5d76e;
    background: rgba(212, 175, 55, 0.1);
    padding: 10px 18px;
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    font-weight: 600;
  }

  .input-card {
    background: rgba(20, 10, 35, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 16px;
    padding: 24px;
  }

  .input-card label {
    display: block;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    margin-top: 16px;
  }

  .input-card label:first-child {
    margin-top: 0;
  }

  .input-card input[type="text"],
  .input-card input[type="file"] {
    width: 100%;
    background: rgba(10, 5, 20, 0.5);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 8px;
    padding: 12px;
    color: #fff;
    font-size: 0.9rem;
    box-sizing: border-box;
    margin-bottom: 8px;
  }

  textarea {
    width: 100%;
    background: rgba(10, 5, 20, 0.5);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
    min-height: 140px;
    outline: none;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
    padding: 14px;
    box-sizing: border-box;
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .options-row {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  select {
    background: rgba(10, 5, 20, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.3);
    color: #f0f0f5;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;
    flex: 1;
    min-width: 180px;
  }

  .create-btn {
    width: 100%;
    padding: 18px;
    font-size: 1.05rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    letter-spacing: 0.05em;
    font-weight: 800;
  }

  /* === PREVIEW UNIVERSELLE === */
  .preview-universal {
    background: rgba(20, 10, 35, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 16px;
    padding: 24px;
    position: relative;
  }

  .preview-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
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
    color: rgba(212, 175, 55, 0.4);
    font-size: 1.3rem;
    font-weight: 900;
    pointer-events: none;
    white-space: nowrap;
    border: 2px solid rgba(212, 175, 55, 0.3);
    padding: 10px 20px;
    background: rgba(10, 5, 20, 0.7);
    letter-spacing: 2px;
  }

  .action-buttons {
    display: flex;
    gap: 14px;
    margin-top: 10px;
  }

  .btn-reject {
    flex: 1;
    padding: 16px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    background: transparent;
    border: 2px solid rgba(212, 175, 55, 0.4);
    color: #f5d76e;
    transition: all 0.2s;
  }
  .btn-reject:hover { border-color: #ff4444; color: #ff6b6b; background: rgba(255, 68, 68, 0.08); }

  .btn-validate {
    flex: 1;
    padding: 16px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    background: linear-gradient(180deg, #f5d76e 0%, #d4af37 50%, #aa7c11 100%);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
    color: #1a0b2e;
    transition: all 0.2s;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 12px rgba(212, 175, 55, 0.3);
  }
  .btn-validate:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5); }

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
    background: rgba(10, 5, 20, 0.6);
    border-radius: 10px;
    border: 1px solid rgba(212, 175, 55, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.3);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .example-thumb:hover { border-color: #d4af37; color: #f5d76e; background: rgba(212, 175, 55, 0.1); }

  .model-info {
    background: rgba(10, 5, 20, 0.5);
    border-radius: 12px;
    padding: 18px;
    border: 1px solid rgba(212, 175, 55, 0.15);
  }

  .model-badge {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .model-name {
    font-size: 1.1rem;
    color: #f5d76e;
    font-weight: 800;
    margin-bottom: 6px;
  }

  .model-desc {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.4;
  }

  /* === CHAT RESPONSE === */
  .chat-response {
    margin-top: 10px;
  }
  .chat-bubble.ai {
    background: rgba(20, 10, 35, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 12px;
    padding: 18px;
    color: #f0f0f5;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  /* === OR CHROME MÉTALLIQUE === */
  .chrome-text {
    background: linear-gradient(to bottom, #ffffff 0%, #f5d76e 25%, #d4af37 50%, #aa7c11 75%, #8b6508 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0px 1px 0px rgba(255, 255, 255, 0.5)) drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8));
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  .chrome-btn {
    background: linear-gradient(180deg, #ffffff 0%, #f5d76e 30%, #d4af37 55%, #aa7c11 80%, #8b6508 100%);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-bottom: 2px solid rgba(0, 0, 0, 0.5);
    color: #1a0b2e;
    font-weight: 900;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 4px 15px rgba(0, 0, 0, 0.4);
    transition: all 0.2s ease;
  }
  .chrome-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5); }
  .chrome-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* === MOBILE === */
  @media (max-width: 1024px) {
    .studio-deevid { flex-direction: column; height: auto; padding: 10px; }
    .sidebar-cl { width: 100%; flex-direction: row; overflow-x: auto; padding: 12px; gap: 8px; }
    .logo-cl { display: none; }
    .nav-item { white-space: nowrap; padding: 12px 16px; font-size: 0.9rem; }
    .preview-side { width: 100%; flex-direction: row; overflow-x: auto; }
    .examples-grid { display: flex; gap: 12px; }
    .example-thumb { width: 80px; height: 80px; flex-shrink: 0; }
    .model-info { min-width: 200px; }
    .action-buttons { flex-direction: column; }
  }
</style>
