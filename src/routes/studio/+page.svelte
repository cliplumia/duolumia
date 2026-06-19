<script>
  export let data;
  
  // === ÉTAT DES SECTIONS ===
  let activeTab = 'images';
  
  // === IMAGES ===
  let imgPrompt = '';
  let imgLoading = false;
  let imgPreviewUrl = null;
  let imgValidatedUrl = null;
  let imgGenerationId = null;
  let imgError = null;
  let imgFormat = '1:1';
  let imgStyle = 'realiste';
  
  // === VIDÉOS ===
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
  
  // === LIPSYNC ===
  let imageBase64 = '';
  let audioUrl = '';
  let lipLoading = false;
  let lipPreviewUrl = null;
  let lipError = null;
  let lipAudioSource = 'upload';
  let lipExpression = 'neutre';
  let lipType = 'parole';
  
  // === VOIX ===
  let voiceText = '';
  let voiceLoading = false;
  let voiceAudioUrl = null;
  let voiceLang = 'FR';
  let voiceType = 'femme';
  let voiceStyle = 'professionnel';
  let voiceEmotion = 'neutre';
  let voiceSpeed = 'normal';
  
  // === CHAT ===
  let chatPrompt = '';
  let chatLoading = false;
  let chatResponse = '';
  let chatRole = 'assistant';
  let chatTone = 'pro';
  let chatFormat = 'texte';
  let chatLength = 'standard';
  
  // === PERMISSIONS ===
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data?.user?.email);
  const canGenerateImg = isAdmin || (data?.user?.images_restantes > 0);
  const canGenerateVid = isAdmin || (data?.user?.videos_restantes > 0);
  
  // === FONCTION GÉNÉRATION IMAGE ===
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
  
  // === FONCTION VALIDATION IMAGE ===
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

  // === FONCTION REJET IMAGE ===
  function rejectImage() {
    imgPreviewUrl = null;
    imgGenerationId = null;
    imgValidatedUrl = null;
    imgPrompt = '';
  }
  
  // === FONCTION GÉNÉRATION VIDÉO ===
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
  
  // === FONCTION VALIDATION VIDÉO ===
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

  // === FONCTION REJET VIDÉO ===
  function rejectVideo() {
    if (vidInterval) clearInterval(vidInterval);
    vidInterval = null;
    vidPreviewUrl = null;
    vidGenerationId = null;
    vidValidatedUrl = null;
    vidPrompt = '';
    vidReplicateId = null;
  }
  
  // === UPLOAD IMAGE LIPSYNC ===
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => imageBase64 = e.target.result;
      reader.readAsDataURL(file);
    }
  }
  
  // === FONCTION GÉNÉRATION LIPSYNC ===
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
  
  // === FONCTION RESET LIPSYNC ===
  function resetLipsync() {
    imageBase64 = '';
    audioUrl = '';
    lipPreviewUrl = null;
    lipError = null;
  }

  // === FONCTION GÉNÉRATION VOIX ===
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

  // === FONCTION GÉNÉRATION CHAT ===
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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="studio-container">
  
  <!-- SIDEBAR GAUCHE -->
  <aside class="sidebar">
    <div class="logo chrome-text">ClipLumia</div>
    
    <button class="nav-item" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>
      🖼️ Images IA
    </button>
    <button class="nav-item" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>
      🎬 Vidéos IA
    </button>
    <button class="nav-item" class:active={activeTab === 'lipsync'} on:click={() => activeTab = 'lipsync'}>
      👄 Lipsync
    </button>
    <button class="nav-item" class:active={activeTab === 'voice'} on:click={() => activeTab = 'voice'}>
      🎤 Voix IA
    </button>
    <button class="nav-item" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>
      💬 Chat IA
    </button>
  </aside>

  <!-- CENTRE : STUDIO PRINCIPAL -->
  <main class="studio-main">
    
    <!-- HEADER AVEC TITRE ET FORFAIT -->
    <div class="studio-header">
      <h1 class="chrome-text studio-title">
        {activeTab === 'images' ? 'Générateur d\'Images IA' : 
         activeTab === 'video' ? 'Générateur de Vidéos IA' :
         activeTab === 'lipsync' ? 'Studio Lipsync' :
         activeTab === 'voice' ? 'Synthèse Vocale IA' : 'Chat IA Assistant'}
      </h1>
      <div class="forfait-badge">Forfait : {data?.user?.images_restantes || 0}</div>
    </div>

    <!-- CARTE DE GÉNÉRATION (Effet Glass) -->
    <div class="generation-card">
      
      <!-- SECTION IMAGES -->
      {#if activeTab === 'images'}
        <textarea bind:value={imgPrompt} placeholder="Décris ton image en détail... Une femme élégante dans un bureau moderne, éclairage doré..."></textarea>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Format</label>
            <select bind:value={imgFormat}>
              <option value="1:1">1:1 (Carré)</option>
              <option value="16:9">16:9 (Paysage)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="tiktok">TikTok</option>
              <option value="4:5">4:5 (Instagram)</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Style</label>
            <select bind:value={imgStyle}>
              <option value="realiste">Réaliste</option>
              <option value="cinematique">Cinématique</option>
              <option value="3d">3D Render</option>
              <option value="anime">Anime</option>
              <option value="illustration">Illustration</option>
              <option value="photographique">Photographique</option>
              <option value="noirblanc">Noir & Blanc</option>
            </select>
          </div>
        </div>
        
        <button class="chrome-btn create-btn" on:click={generateImage} disabled={imgLoading || !canGenerateImg}>
          {imgLoading ? '⏳ Génération en cours...' : '✨ CRÉER L\'IMAGE'}
        </button>
      {/if}

      <!-- SECTION VIDÉO -->
      {#if activeTab === 'video'}
        <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo... Un drone survolant une ville futuriste au crépuscule..."></textarea>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Format</label>
            <select bind:value={vidFormat}>
              <option value="16:9">16:9</option>
              <option value="tiktok">TikTok</option>
              <option value="1:1">1:1</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Style</label>
            <select bind:value={vidStyle}>
              <option value="cinematique">Cinématique</option>
              <option value="dynamique">Dynamique</option>
              <option value="lent">Lent/Slow</option>
              <option value="timelapse">Time-lapse</option>
              <option value="vlog">Vlog</option>
              <option value="publicitaire">Publicitaire</option>
            </select>
          </div>
        </div>
        
        <button class="chrome-btn create-btn" on:click={generateVideo} disabled={vidLoading || !canGenerateVid}>
          {vidLoading ? '⏳ Génération en cours...' : '🎬 CRÉER LA VIDÉO'}
        </button>
      {/if}

      <!-- SECTION LIPSYNC -->
      {#if activeTab === 'lipsync'}
        <div class="input-group">
          <label>1. Photo du visage</label>
          <input type="file" accept="image/*" on:change={handleImageUpload} class="file-input" />
        </div>
        
        <div class="input-group">
          <label>2. Source Audio</label>
          <select bind:value={lipAudioSource}>
            <option value="upload">Upload fichier audio</option>
            <option value="tts">Texte à vocaliser</option>
            <option value="url">URL audio externe</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>3. URL Audio ou Texte</label>
          <input type="text" bind:value={audioUrl} placeholder="https://..." class="text-input" />
        </div>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Expression Faciale</label>
            <select bind:value={lipExpression}>
              <option value="neutre">Neutre (naturelle)</option>
              <option value="souriant">Souriant (joyeux)</option>
              <option value="serieux">Sérieux (professionnel)</option>
              <option value="intense">Émotion intense</option>
              <option value="precise">Synchronisation précise</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Type de Performance</label>
            <select bind:value={lipType}>
              <option value="parole">Parole seule (discours)</option>
              <option value="chant">Chant (musique)</option>
              <option value="performance">Performance artistique</option>
              <option value="presentation">Présentation pro</option>
            </select>
          </div>
        </div>
        
        <button class="chrome-btn create-btn" on:click={generateLipsync} disabled={lipLoading || !imageBase64 || !audioUrl}>
          {lipLoading ? '⏳ Synchronisation...' : '👄 CRÉER LE LIPSYNC'}
        </button>
      {/if}

      <!-- SECTION VOIX -->
      {#if activeTab === 'voice'}
        <textarea bind:value={voiceText} placeholder="Écris le texte à vocaliser..."></textarea>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Langue</label>
            <select bind:value={voiceLang}>
              <option value="FR">Français</option>
              <option value="EN">Anglais</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Type de Voix</label>
            <select bind:value={voiceType}>
              <option value="femme">Femme</option>
              <option value="homme">Homme</option>
              <option value="enfant">Enfant</option>
              <option value="mature">Voix mature</option>
            </select>
          </div>
        </div>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Style</label>
            <select bind:value={voiceStyle}>
              <option value="professionnel">Professionnel</option>
              <option value="chaleureux">Chaleureux</option>
              <option value="dynamique">Dynamique</option>
              <option value="calme">Calme</option>
              <option value="narratif">Narratif</option>
              <option value="publicitaire">Publicitaire</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Émotion</label>
            <select bind:value={voiceEmotion}>
              <option value="neutre">Neutre</option>
              <option value="joyeux">Joyeux</option>
              <option value="serieux">Sérieux</option>
              <option value="dramatique">Dramatique</option>
              <option value="enthousiaste">Enthousiaste</option>
            </select>
          </div>
        </div>
        
        <div class="option-group full-width">
          <label>Vitesse</label>
          <select bind:value={voiceSpeed}>
            <option value="lent">Lent</option>
            <option value="normal">Normal</option>
            <option value="rapide">Rapide</option>
          </select>
        </div>
        
        <button class="chrome-btn create-btn" on:click={generateVoice} disabled={voiceLoading}>
          {voiceLoading ? '⏳ Génération...' : '🎤 CRÉER LA VOIX'}
        </button>
      {/if}

      <!-- SECTION CHAT (SANS J'AIME/REJETER) -->
      {#if activeTab === 'chat'}
        <textarea bind:value={chatPrompt} placeholder="Pose ta question ou donne tes instructions..."></textarea>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Rôle de l'IA</label>
            <select bind:value={chatRole}>
              <option value="assistant">Assistant Général</option>
              <option value="copywriter">Copywriter</option>
              <option value="scenariste">Scénariste</option>
              <option value="coach">Coach</option>
              <option value="traducteur">Traducteur</option>
              <option value="expert">Expert Tech</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Ton</label>
            <select bind:value={chatTone}>
              <option value="pro">Professionnel</option>
              <option value="creatif">Créatif</option>
              <option value="direct">Direct</option>
              <option value="pedagogique">Pédagogique</option>
              <option value="humoristique">Humoristique</option>
            </select>
          </div>
        </div>
        
        <div class="options-grid">
          <div class="option-group">
            <label>Format de réponse</label>
            <select bind:value={chatFormat}>
              <option value="texte">Texte simple</option>
              <option value="liste">Liste à puces</option>
              <option value="etapes">Étapes détaillées</option>
              <option value="tableau">Tableau</option>
            </select>
          </div>
          
          <div class="option-group">
            <label>Longueur</label>
            <select bind:value={chatLength}>
              <option value="resume">Résumé</option>
              <option value="standard">Standard</option>
              <option value="detaille">Très détaillé</option>
            </select>
          </div>
        </div>
        
        <button class="chrome-btn create-btn" on:click={generateChat} disabled={chatLoading}>
          {chatLoading ? '⏳ Réflexion...' : '💬 ENVOYER'}
        </button>
        
        {#if chatResponse}
          <div class="chat-response">
            <div class="chat-bubble">{chatResponse}</div>
          </div>
        {/if}
      {/if}
    </div>

    <!-- ZONE DE PRÉVISUALISATION -->
    {#if imgPreviewUrl || vidPreviewUrl || lipPreviewUrl || voiceAudioUrl}
      <div class="preview-card">
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

        <div class="watermark">CLIPLUMIA · PREVIEW</div>
      </div>
    {/if}

    <!-- BOUTONS J'AIME / REJETER (SAUF POUR CHAT) -->
    {#if activeTab !== 'chat'}
      <div class="action-buttons">
        <button class="btn-reject" on:click={activeTab === 'images' ? rejectImage : activeTab === 'video' ? rejectVideo : activeTab === 'lipsync' ? resetLipsync : null}>
          ❌ Rejeter (0€)
        </button>
        <button class="btn-validate" on:click={activeTab === 'images' ? validateImage : activeTab === 'video' ? validateVideo : null}>
          ✅ J'aime (1 Forfait)
        </button>
      </div>
    {/if}

    <!-- GALERIE D'EXEMPLES (En bas, page déroulante) -->
    <div class="examples-section">
      <h2 class="chrome-text section-title">Exemples de Réalisations</h2>
      <div class="examples-grid-full">
        <div class="example-item">Exemple 1</div>
        <div class="example-item">Exemple 2</div>
        <div class="example-item">Exemple 3</div>
        <div class="example-item">Exemple 4</div>
      </div>
    </div>

    <!-- FAQ (En bas, page déroulante) -->
    <div class="faq-section">
      <h2 class="chrome-text section-title">Questions Fréquentes</h2>
      
      <div class="faq-item">
        <h3>❓ Comment fonctionnent les forfaits ClipLumia ?</h3>
        <p>Chaque forfait vous donne accès à une création IA. Vous choisissez votre modèle, décrivez votre projet, et notre studio génère le résultat. Un forfait = une création validée.</p>
      </div>
      
      <div class="faq-item">
        <h3>❓ Que se passe-t-il si je n'aime pas le résultat ?</h3>
        <p>C'est la force ClipLumia ! Si le résultat ne vous convient pas, cliquez sur <strong>"Rejeter (0€)"</strong> : vous ne payez rien et pouvez relancer une nouvelle génération. Si vous aimez, cliquez sur <strong>"J'aime (1 Forfait)"</strong> : le forfait est utilisé et la création est à vous.</p>
      </div>
      
      <div class="faq-item">
        <h3>❓ Puis-je utiliser les créations pour mon business ?</h3>
        <p>Oui, absolument ! Toutes les images, vidéos et contenus générés via ClipLumia sont libres de droits pour un usage commercial (réseaux sociaux, sites web, publicités, etc.).</p>
      </div>
      
      <div class="faq-item">
        <h3>❓ Mes créations sont-elles privées ?</h3>
        <p>Oui, 100% privées. Personne d'autre que vous ne peut voir ou accéder à vos générations. Nous ne les partageons pas et ne les utilisons pas sans votre accord.</p>
      </div>
      
      <div class="faq-item">
        <h3>❓ Comment contacter le support en cas de problème ?</h3>
        <p>Notre équipe est disponible via le formulaire de contact ou par email à contact@cliplumia.com. Nous répondons sous 24h maximum.</p>
      </div>
    </div>
  </main>
</div>

<style>
  /* === CONTENEUR PRINCIPAL === */
  .studio-container {
    display: flex;
    gap: 20px;
    min-height: calc(100vh - 80px);
    padding: 20px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #0f0518 100%);
  }

  /* === SIDEBAR GAUCHE (Effet Glass) === */
  .sidebar {
    width: 280px;
    background: rgba(45, 27, 78, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-shrink: 0;
    border: 1px solid rgba(212, 175, 55, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 40px;
    padding: 10px;
  }

  .nav-item {
    padding: 18px 20px;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    font-size: 1.05rem;
    font-weight: 600;
    transition: all 0.3s ease;
    background: transparent;
    border: 1px solid transparent;
    text-align: left;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  .nav-item:hover { 
    background: rgba(212, 175, 55, 0.1); 
    color: #fff;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }
  
  .nav-item.active {
    background: rgba(212, 175, 55, 0.2);
    color: #f5d76e;
    border: 1px solid rgba(212, 175, 55, 0.4);
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
  }

  /* === CENTRE : STUDIO === */
  .studio-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 25px;
    overflow-y: auto;
    padding-right: 10px;
    max-width: calc(100% - 300px);
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    padding: 10px;
  }

  .studio-title {
    font-size: 1.8rem;
    margin: 0;
    font-weight: 900;
  }

  .forfait-badge {
    font-size: 1rem;
    color: #f5d76e;
    background: rgba(212, 175, 55, 0.15);
    padding: 12px 22px;
    border-radius: 25px;
    border: 1px solid rgba(212, 175, 55, 0.35);
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
  }

  /* === CARTE DE GÉNÉRATION (Effet Glass) === */
  .generation-card {
    background: rgba(20, 10, 35, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  textarea {
    width: 100%;
    background: rgba(10, 5, 20, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 12px;
    color: #ffffff;
    font-size: 1.05rem;
    min-height: 150px;
    outline: none;
    resize: vertical;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    padding: 18px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  textarea:focus {
    border-color: rgba(212, 175, 55, 0.5);
    background: rgba(10, 5, 20, 0.8);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group label {
    display: block;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .file-input,
  .text-input {
    width: 100%;
    background: rgba(10, 5, 20, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 10px;
    padding: 14px;
    color: #ffffff;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .text-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 20px;
  }

  .option-group {
    display: flex;
    flex-direction: column;
  }

  .option-group.full-width {
    grid-column: 1 / -1;
    margin-top: 16px;
  }

  .option-group label {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
  }

  select {
    background: rgba(10, 5, 20, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: #f0f0f5;
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 0.95rem;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
  }

  select:hover {
    border-color: rgba(212, 175, 55, 0.5);
  }

  select:focus {
    border-color: rgba(212, 175, 55, 0.6);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
  }

  .create-btn {
    width: 100%;
    padding: 20px;
    font-size: 1.1rem;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    letter-spacing: 0.08em;
    font-family: 'Inter', sans-serif;
    font-weight: 900;
    margin-top: 25px;
    transition: all 0.3s ease;
  }

  /* === CARTE DE PRÉVISUALISATION (Effet Glass) === */
  .preview-card {
    background: rgba(20, 10, 35, 0.5);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(212, 175, 55, 0.2);
    border-radius: 20px;
    padding: 30px;
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .preview-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .preview-media {
    width: 100%;
    border-radius: 14px;
    overflow: hidden;
    background: #000;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-media img, 
  .preview-media video {
    max-width: 100%;
    max-height: 450px;
    display: block;
  }

  .watermark {
    position: absolute;
    top: 50%; 
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    color: rgba(212, 175, 55, 0.4);
    font-size: 1.5rem;
    font-weight: 900;
    pointer-events: none;
    white-space: nowrap;
    border: 2px solid rgba(212, 175, 55, 0.35);
    padding: 12px 25px;
    background: rgba(10, 5, 20, 0.7);
    letter-spacing: 3px;
    border-radius: 10px;
  }

  /* === BOUTONS J'AIME / REJETER === */
  .action-buttons {
    display: flex;
    gap: 16px;
  }

  .btn-reject {
    flex: 1;
    padding: 18px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .btn-reject:hover { 
    border-color: #ff4444; 
    color: #ff6b6b; 
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 68, 68, 0.2);
  }

  .btn-validate {
    flex: 1;
    padding: 18px;
    border-radius: 14px;
    font-weight: 900;
    font-size: 1rem;
    cursor: pointer;
    background: linear-gradient(180deg, #f5d76e 0%, #d4af37 50%, #aa7c11 100%);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-bottom: 2px solid rgba(0, 0, 0, 0.4);
    color: #1a0b2e;
    transition: all 0.3s ease;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 6px 20px rgba(212, 175, 55, 0.35);
  }
  
  .btn-validate:hover { 
    filter: brightness(1.15); 
    transform: translateY(-3px); 
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
  }

  /* === GALERIE D'EXEMPLES === */
  .examples-section {
    margin-top: 40px;
    padding: 30px;
    background: rgba(20, 10, 35, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.15);
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 25px;
    text-align: center;
  }

  .examples-grid-full {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .example-item {
    aspect-ratio: 16/9;
    background: rgba(10, 5, 20, 0.6);
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .example-item:hover {
    border-color: #d4af37;
    color: #f5d76e;
    background: rgba(212, 175, 55, 0.1);
    transform: translateY(-3px);
  }

  /* === FAQ === */
  .faq-section {
    margin-top: 40px;
    padding: 30px;
    background: rgba(20, 10, 35, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.15);
  }

  .faq-item {
    margin-bottom: 25px;
    padding: 20px;
    background: rgba(10, 5, 20, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(212, 175, 55, 0.1);
  }

  .faq-item h3 {
    color: #f5d76e;
    font-size: 1.1rem;
    margin-bottom: 12px;
    font-weight: 700;
  }

  .faq-item p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .faq-item strong {
    color: #f5d76e;
  }

  /* === CHAT RESPONSE === */
  .chat-response {
    margin-top: 20px;
  }
  
  .chat-bubble {
    background: rgba(20, 10, 35, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.25);
    border-radius: 14px;
    padding: 20px;
    color: #f0f0f5;
    font-size: 1rem;
    line-height: 1.7;
  }

  /* === OR CHROME MÉTALLIQUE 3D === */
  .chrome-text {
    background: linear-gradient(to bottom, 
      #ffffff 0%, 
      #f5d76e 20%, 
      #d4af37 45%, 
      #aa7c11 70%, 
      #8b6508 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: 
      drop-shadow(0px 1px 0px rgba(255, 255, 255, 0.6))
      drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))
      drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.6));
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  .chrome-btn {
    background: linear-gradient(180deg, 
      #ffffff 0%, 
      #f5d76e 25%, 
      #d4af37 50%, 
      #aa7c11 75%, 
      #8b6508 100%
    );
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-bottom: 2px solid rgba(0, 0, 0, 0.6);
    color: #1a0b2e;
    font-weight: 900;
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.8), 
      inset 0 -1px 0 rgba(0, 0, 0, 0.2), 
      0 6px 20px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }
  
  .chrome-btn:hover:not(:disabled) { 
    filter: brightness(1.15); 
    transform: translateY(-3px); 
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5); 
  }
  
  .chrome-btn:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  .chrome-btn:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }

  /* === RESPONSIVE MOBILE === */
  @media (max-width: 1024px) {
    .studio-container { 
      flex-direction: column; 
      padding: 15px; 
      gap: 15px;
    }
    
    .sidebar { 
      width: 100%; 
      flex-direction: row; 
      overflow-x: auto; 
      padding: 15px; 
      gap: 10px; 
    }
    
    .logo { 
      display: none; 
    }
    
    .nav-item { 
      white-space: nowrap; 
      padding: 14px 18px; 
      font-size: 0.95rem;
      min-width: fit-content;
    }
    
    .studio-main {
      max-width: 100%;
    }
    
    .options-grid {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .studio-title {
      font-size: 1.4rem;
    }
  }

  @media (max-width: 768px) {
    .generation-card,
    .preview-card,
    .examples-section,
    .faq-section {
      padding: 20px;
    }
    
    textarea {
      min-height: 120px;
      font-size: 0.95rem;
    }
    
    .create-btn {
      padding: 16px;
      font-size: 1rem;
    }
  }
</style>
