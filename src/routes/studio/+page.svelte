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
  let voiceSpeaker = 'Serena';
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

  // === RESET QUAND ON CHANGE D'ONGLET ===
  $: {
    if (activeTab === 'images') {
      vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; voiceAudioUrl = ''; chatResponse = '';
    } else if (activeTab === 'video') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; lipPreviewUrl = ''; voiceAudioUrl = ''; chatResponse = '';
    } else if (activeTab === 'lipsync') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; voiceAudioUrl = ''; chatResponse = '';
    } else if (activeTab === 'voice') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; chatResponse = '';
    } else if (activeTab === 'chat') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; voiceAudioUrl = '';
    }
  }

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
        body: JSON.stringify({ prompt: imgPrompt, format: imgFormat, style: imgStyle })
      });
      const result = await res.json();
      
      if (!res.ok) {
        imgError = result.error || 'Erreur de génération';
        imgLoading = false;
        return;
      }
      
      imgPreviewUrl = result.image;
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
        data.user.images_restantes--;
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
        body: JSON.stringify({ prompt: vidPrompt, format: vidFormat, style: vidStyle })
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
        data.user.videos_restantes--;
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

  // === UPLOAD AUDIO LIPSYNC ===
  function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => { audioUrl = e.target.result; };
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
      const imageUploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64: imageBase64, fileType: 'image' })
      });
      
      const imageUploadData = await imageUploadRes.json();
      
      if (!imageUploadRes.ok || !imageUploadData.success) {
        throw new Error(imageUploadData.error || 'Erreur upload image');
      }
      
      const publicImageUrl = imageUploadData.url;

      let publicAudioUrl = audioUrl;
      
      if (audioUrl.startsWith('data:audio')) {
        const audioUploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: audioUrl, fileType: 'audio' })
        });
        
        const audioUploadData = await audioUploadRes.json();
        
        if (!audioUploadRes.ok || !audioUploadData.success) {
          throw new Error(audioUploadData.error || 'Erreur upload audio');
        }
        
        publicAudioUrl = audioUploadData.url;
      }

      const res = await fetch('/api/lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: publicImageUrl,
          audio: publicAudioUrl,
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
    imageBase64 = null;
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
        speaker: voiceSpeaker, 
        lang: voiceLang,
        emotion: voiceEmotion
      })
    });
    const result = await res.json();
    
    if (result.success) {
      voiceAudioUrl = result.url;
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
        body: JSON.stringify({ message: chatPrompt })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        chatResponse = data.reply;
      } else {
        chatResponse = '❌ Erreur : ' + (data.error || 'Impossible de générer la réponse');
      }
    } catch (e) {
      chatResponse = '❌ Erreur : ' + e.message;
    }
    
    chatLoading = false;
  }
</script>

<svelte:head>
  <title>Studio — ClipLumia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="studio-page">
  <div class="studio-container">
    
    <!-- SIDEBAR GAUCHE -->
    <aside class="sidebar glass">
      <div class="logo chrome-text">ClipLumia</div>
      
      <button type="button" class="nav-item" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>
        🖼️ Images IA
      </button>
      <button type="button" class="nav-item" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>
        🎬 Vidéos IA
      </button>
      <button type="button" class="nav-item" class:active={activeTab === 'lipsync'} on:click={() => activeTab = 'lipsync'}>
        👄 Lipsync
      </button>
      <button type="button" class="nav-item" class:active={activeTab === 'voice'} on:click={() => activeTab = 'voice'}>
        🎤 Voix IA {#if data?.user?.plan === 'gratuit' || !data?.user?.plan}<span class="lock-icon">🔒</span>{/if}
      </button>
      <button type="button" class="nav-item" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>
        💬 Chat IA {#if data?.user?.plan === 'gratuit' || !data?.user?.plan}<span class="lock-icon">🔒</span>{/if}
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
        <div class="forfait-badge chrome-gold">📸 {data?.user?.images_restantes || 0} | 🎬 {data?.user?.videos_restantes || 0}</div>
       </div>

     <!-- CARTE DE GÉNÉRATION -->
      <div class="generation-card glass">
        
        <!-- SECTION IMAGES -->
        {#if activeTab === 'images'}
          <textarea bind:value={imgPrompt} placeholder="Décris ton image en détail... Une femme élégante dans un bureau moderne, éclairage doré..."></textarea>
           
          <div class="options-grid">
            <div class="option-group">
              <label for="img-format">Format</label>
              <select id="img-format" bind:value={imgFormat}>
                <option value="1:1">1:1 (Carré)</option>
                <option value="16:9">16:9 (Paysage)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="tiktok">TikTok</option>
                <option value="4:5">4:5 (Instagram)</option>
              </select>
            </div>
            
            <div class="option-group">
              <label for="img-style">Style</label>
              <select id="img-style" bind:value={imgStyle}>
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
          
        <button class="chrome-btn create-btn" on:click={generateImage} disabled={imgLoading || (data?.user?.tentatives_images <= 0)}>
        {imgLoading ? '⏳ Génération en cours...' : "✨ CRÉER L'IMAGE"}
       </button>

          {#if data?.user?.tentatives_images <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">
              ⚠️ Vous avez utilisé vos 3 essais gratuits. Validez une création ou passez à un Forfait !
            </p>
          {/if}
        {/if}

        <!-- SECTION VIDÉO -->
        {#if activeTab === 'video'}
          <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo... Un drone survolant une ville futuriste au crépuscule..."></textarea>
           
          <div class="options-grid">
            <div class="option-group">
              <label for="vid-format">Format</label>
              <select id="vid-format" bind:value={vidFormat}>
                <option value="16:9">16:9</option>
                <option value="tiktok">TikTok</option>
                <option value="1:1">1:1</option>
              </select>
            </div>
            
            <div class="option-group">
              <label for="vid-style">Style</label>
              <select id="vid-style" bind:value={vidStyle}>
                <option value="cinematique">Cinématique</option>
                <option value="dynamique">Dynamique</option>
                <option value="lent">Lent/Slow</option>
                <option value="timelapse">Time-lapse</option>
                <option value="vlog">Vlog</option>
                <option value="publicitaire">Publicitaire</option>
              </select>
            </div>
          </div>
          
         <button class="chrome-btn create-btn" on:click={generateVideo} disabled={vidLoading || (data?.user?.tentatives_videos <= 0)}>
         {vidLoading ? '⏳ Génération en cours...' : '🎬 CRÉER LA VIDÉO'}
         </button>

          {#if data?.user?.tentatives_videos <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">
              ⚠️ Vous avez utilisé vos 3 essais gratuits. Validez une création ou passez à un Forfait !
            </p>
          {/if}
        {/if}

        <!-- SECTION LIPSYNC -->
        {#if activeTab === 'lipsync'}
          <div class="input-group">
            <label for="lip-photo">1. Photo du visage</label>
            <input id="lip-photo" type="file" accept="image/*" on:change={handleImageUpload} class="file-input" />
          </div>

          <div class="input-group">
            <label for="lip-audio-source">2. Source Audio</label>
            <select id="lip-audio-source" bind:value={lipAudioSource}>
              <option value="upload">Upload fichier audio</option>
              <option value="tts">Texte à vocaliser</option>
              <option value="url">URL audio externe</option>
            </select>
          </div>
  
          {#if lipAudioSource === 'upload'}
            <div class="input-group">
              <label for="lip-audio-file">3. Fichier Audio</label>
              <input id="lip-audio-file" type="file" accept="audio/*" on:change={handleAudioUpload} class="file-input" />
            </div>
          {/if}
  
          {#if lipAudioSource === 'url' || lipAudioSource === 'tts'}
            <div class="input-group">
              <label for="lip-audio-text">3. URL Audio ou Texte</label>
              <input id="lip-audio-text" type="text" bind:value={audioUrl} placeholder={lipAudioSource === 'url' ? 'https://...' : 'Tapez votre texte ici...'} class="text-input" />
            </div>
          {/if}
  
          <div class="options-grid">
            <div class="option-group">
              <label for="lip-expression">Expression Faciale</label>
              <select id="lip-expression" bind:value={lipExpression}>
                <option value="neutre">Neutre (naturelle)</option>
                <option value="souriant">Souriant (joyeux)</option>
                <option value="serieux">Sérieux (professionnel)</option>
                <option value="intense">Émotion intense</option>
                <option value="precise">Synchronisation précise</option>
              </select>
            </div>
    
            <div class="option-group">
              <label for="lip-type">Type de Performance</label>
              <select id="lip-type" bind:value={lipType}>
                <option value="parole">Parole seule (discours)</option>
                <option value="chant">Chant (musique)</option>
                <option value="performance">Performance artistique</option>
                <option value="presentation">Présentation pro</option>
              </select>
            </div>
          </div>
          
         <button class="chrome-btn create-btn" on:click={generateLipsync} disabled={lipLoading || (data?.user?.tentatives_videos <= 0)}>
         {lipLoading ? '⏳ Génération en cours...' : '👄 CRÉER LE LIPSYNC'}
         </button>

          {#if data?.user?.tentatives_videos <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">
              ⚠️ Vous avez utilisé vos 3 essais gratuits. Validez une création ou passez à un Forfait !
            </p>
          {/if}

          {#if lipPreviewUrl}
            <div style="margin-top: 30px; text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.3);">
              <h3 style="color: #d4af37; margin-bottom: 15px;">✨ Votre Lipsync est prêt !</h3>
              <video controls autoplay loop style="width: 100%; max-width: 500px; border-radius: 12px; border: 2px solid #d4af37;">
                <source src={lipPreviewUrl} type="video/mp4">
                Votre navigateur ne supporte pas la vidéo.
              </video>
              <br>
              <a href={lipPreviewUrl} download="lipsync-cliplumia.mp4" class="chrome-btn" style="margin-top: 15px; display: inline-block; text-decoration: none;">
                Télécharger la vidéo
              </a>
            </div>
          {/if}
        {/if}

     <!-- SECTION VOIX -->
{#if activeTab === 'voice'}
  <textarea bind:value={voiceText} placeholder="Écris le texte à vocaliser..."></textarea>

  <div class="options-grid">
    <div class="option-group">
      <label for="voice-lang">Langue</label>
      <select id="voice-lang" bind:value={voiceLang}>
        <option value="auto">Auto</option>
        <option value="French">Français</option>
        <option value="English">Anglais</option>
      </select>
    </div>

    <div class="option-group">
      <label for="voice-speaker">Voix</label>
      <select id="voice-speaker" bind:value={voiceSpeaker}>
        <optgroup label="Féminines">
          <option value="Serena">Serena</option>
          <option value="Ono_anna">Ono Anna</option>
        </optgroup>
        <optgroup label="Masculines">
          <option value="Aiden">Aiden</option>
          <option value="Eric">Eric</option>
          <option value="Ryan">Ryan</option>
          <option value="Dylan">Dylan</option>
          <option value="Uncle_fu">Uncle Fu</option>
          <option value="Sohee">Sohee</option>
          <option value="Vivian">Vivian</option>
        </optgroup>
        <optgroup label="Enfant">
          <option value="Ono_anna">Fille (Ono Anna)</option>
          <option value="Dylan">Garçon (Dylan)</option>
        </optgroup>
      </select>
    </div>

    <div class="option-group">
      <label for="voice-emotion">Émotion</label>
      <select id="voice-emotion" bind:value={voiceEmotion}>
        <option value="">Neutre</option>
        <option value="ton joyeux et enthousiaste">Joyeux</option>
        <option value="ton sérieux et posé">Sérieux</option>
        <option value="ton doux et calme">Calme</option>
        <option value="ton dramatique et intense">Dramatique</option>
        <option value="ton dynamique et énergique">Dynamique</option>
      </select>
    </div>
  </div>

  <button class="chrome-btn create-btn" on:click={generateVoice} disabled={voiceLoading}>
    {voiceLoading ? '⏳ Génération...' : '🎤 CRÉER LA VOIX'}
  </button>
{/if}

        <!-- SECTION CHAT -->
        {#if activeTab === 'chat'}
          <textarea bind:value={chatPrompt} placeholder="Pose ta question ou donne tes instructions..."></textarea>
          
          <div class="options-grid">
            <div class="option-group">
              <label for="chat-role">Rôle de l'IA</label>
              <select id="chat-role" bind:value={chatRole}>
                <option value="assistant">Assistant Général</option>
                <option value="copywriter">Copywriter</option>
                <option value="scenariste">Scénariste</option>
                <option value="coach">Coach</option>
                <option value="traducteur">Traducteur</option>
                <option value="expert">Expert Tech</option>
              </select>
            </div>
            
            <div class="option-group">
              <label for="chat-tone">Ton</label>
              <select id="chat-tone" bind:value={chatTone}>
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
              <label for="chat-format">Format de réponse</label>
              <select id="chat-format" bind:value={chatFormat}>
                <option value="texte">Texte simple</option>
                <option value="liste">Liste à puces</option>
                <option value="etapes">Étapes détaillées</option>
                <option value="tableau">Tableau</option>
              </select>
            </div>
            
            <div class="option-group">
              <label for="chat-length">Longueur</label>
              <select id="chat-length" bind:value={chatLength}>
                <option value="resume">Résumé</option>
                <option value="standard">Standard</option>
                <option value="detaille">Très détaillé</option>
              </select>
            </div>
          </div>
          
          <button type="button" class="chrome-btn create-btn" on:click={generateChat} disabled={chatLoading}>
            {chatLoading ? '⏳ Réflexion...' : '💬 ENVOYER'}
          </button>
          
          {#if chatResponse}
            <div class="chat-response">
              <div class="chat-bubble">{chatResponse}</div>
            </div>
          {/if}
        {/if}

        <!-- ZONE DE PRÉVISUALISATION -->
        {#if activeTab !== 'chat'}
          {#if imgPreviewUrl || imgValidatedUrl || vidPreviewUrl || vidValidatedUrl || lipPreviewUrl || voiceAudioUrl}
            <div class="preview-card glass">
              <div class="preview-label">VOTRE CRÉATION</div>
              {#if imgPreviewUrl}
                <div class="preview-media"><img src={imgPreviewUrl} alt="Preview" /></div>
                <div class="watermark">CLIPLUMIA · PREVIEW</div>
              {:else if imgValidatedUrl}
                <div class="preview-media validated"><img src={imgValidatedUrl} alt="Validated" /></div>
                <a href={imgValidatedUrl} download="cliplumia-creation.webp" class="download-btn">⬇️ TÉLÉCHARGER L'IMAGE</a>
              {:else if vidPreviewUrl}
                <div class="preview-media"><video src={vidPreviewUrl} controls loop muted playsinline></video></div>
                <div class="watermark">CLIPLUMIA · PREVIEW</div>
              {:else if vidValidatedUrl}
                <div class="preview-media validated"><video src={vidValidatedUrl} controls loop playsinline></video></div>
                <a href={vidValidatedUrl} download="cliplumia-video.mp4" class="download-btn">⬇️ TÉLÉCHARGER LA VIDÉO</a>
              {:else if voiceAudioUrl}
                <div class="preview-media audio-player"><audio src={voiceAudioUrl} controls></audio></div>
              {/if}
            </div>
          {/if}
        {/if}

        <!-- BOUTONS J'AIME / REJETER (SAUF POUR CHAT) -->
        {#if activeTab !== 'chat' && activeTab !== 'lipsync'}
          {#if imgPreviewUrl || vidPreviewUrl || voiceAudioUrl}
            <div class="action-buttons">
              <button class="btn-reject" on:click={activeTab === 'images' ? rejectImage : activeTab === 'video' ? rejectVideo : null}>
                ❌ Rejeter (0€)
              </button>
              <button class="btn-validate" on:click={activeTab === 'images' ? validateImage : activeTab === 'video' ? validateVideo : null}>
                ✅ J'aime (1 Forfait)
              </button>
            </div>
          {/if}
        {/if}
      </div>

      <!-- GALERIE D'EXEMPLES -->
      <div class="examples-section glass">
        <h2 class="chrome-text section-title">Exemples de Réalisations</h2>
        <div class="examples-grid-full">
          <div class="example-item">Exemple 1</div>
          <div class="example-item">Exemple 2</div>
          <div class="example-item">Exemple 3</div>
          <div class="example-item">Exemple 4</div>
        </div>
      </div>
     
      <!-- FAQ -->
      <div class="faq-section glass">
        <h2 class="chrome-text section-title">Questions Fréquentes</h2>
        
        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Comment fonctionnent les forfaits ClipLumia ?</h3>
          <p>Chaque forfait vous donne accès à une création IA. Vous choisissez votre modèle, décrivez votre projet, et notre studio génère le résultat. Un forfait = une création validée.</p>
        </div>
        
        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Que se passe-t-il si je n'aime pas le résultat ?</h3>
          <p>C'est la force ClipLumia ! Si le résultat ne vous convient pas, cliquez sur <strong class="chrome-gold-text">"Rejeter (0€)"</strong> : vous ne payez rien et pouvez relancer une nouvelle génération. Si vous aimez, cliquez sur <strong class="chrome-gold-text">"J'aime (1 Forfait)"</strong> : le forfait est utilisé et la création est à vous.</p>
        </div>
        
        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Puis-je utiliser les créations pour mon business ?</h3>
          <p>Oui, absolument ! Toutes les images, vidéos et contenus générés via ClipLumia sont libres de droits pour un usage commercial (réseaux sociaux, sites web, publicités, etc.).</p>
        </div>
        
        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Mes créations sont-elles privées ?</h3>
          <p>Oui, 100% privées. Personne d'autre que vous ne peut voir ou accéder à vos générations. Nous ne les partageons pas et ne les utilisons pas sans votre accord.</p>
        </div>
        
        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Comment contacter le support en cas de problème ?</h3>
          <p>Notre équipe est disponible via le formulaire de contact ou par email à contact@cliplumia.com. Nous répondons sous 24h maximum.</p>
        </div>
      </div>
    </main>
  </div>
</div>



<style>
  :global(*) { box-sizing: border-box; }
  :global(body) { 
    margin: 0; 
    font-family: 'Inter', system-ui, sans-serif; 
    color: #fff; 
    -webkit-font-smoothing: antialiased; 
    overflow-x: hidden; 
    background: #0c0618;
  }

  .chrome-text {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  .chrome-btn {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    border: 2px solid #FCF6BA;
    border-bottom: 3px solid #8B6508;
    color: #1a0b2e;
    font-weight: 900;
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.6), inset 0 1px 0 rgba(255,255,255,0.6);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    transition: all 0.3s ease;
  }
  
  .chrome-btn:hover:not(:disabled) { 
    filter: brightness(1.1); 
    transform: translateY(-2px); 
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.9), inset 0 1px 0 rgba(255,255,255,0.8);
  }

  .studio-page {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    max-width: 100vw;
    background-image: url('https://pub-6476d128f599432f96789b76ebbca25a.r2.dev/image%20fond%20page%20svelte.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }

  .studio-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(12, 6, 24, 0.5);
    z-index: 0;
    pointer-events: none;
  }

  .glass {
    position: relative;
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 20px;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4), 
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    z-index: 2;
  }

  .studio-container {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 20px;
    min-height: calc(100vh - 40px);
    padding: 20px;
    box-sizing: border-box;
    max-width: 1400px;
    margin: 0 auto;
  }

  .sidebar {
    width: 280px;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-shrink: 0;
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
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .nav-item:hover { 
    background: rgba(255, 255, 255, 0.06); 
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  
  .nav-item.active {
    background: rgba(191, 149, 63, 0.12);
    border: 1px solid rgba(191, 149, 63, 0.3);
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .lock-icon {
    font-size: 0.7rem;
    margin-left: 4px;
    opacity: 0.6;
  }

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
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  .forfait-badge {
    font-size: 1rem;
    padding: 12px 22px;
    border-radius: 25px;
    border: 1px solid rgba(191, 149, 63, 0.3);
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .generation-card {
    padding: 30px;
  }

  textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
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
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  textarea:focus {
    border-color: rgba(191, 149, 63, 0.4);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.1);
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group label {
    display: block;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 10px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .file-input,
  .text-input {
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 14px;
    color: #ffffff;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .text-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
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
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  select {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #f0f0f5;
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 0.95rem;
    outline: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  select:hover {
    border-color: rgba(191, 149, 63, 0.4);
  }

  select:focus {
    border-color: rgba(191, 149, 63, 0.5);
    box-shadow: 0 0 15px rgba(191, 149, 63, 0.15);
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

  .preview-card {
    padding: 30px;
    position: relative;
    margin-top: 25px;
  }

  .preview-label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
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
    border: 1px solid rgba(255, 255, 255, 0.1);
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
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    font-weight: 900;
    pointer-events: none;
    white-space: nowrap;
    border: 2px solid rgba(255, 255, 255, 0.6);
    padding: 12px 25px;
    background: rgba(0, 0, 0, 0.5);
    letter-spacing: 3px;
    border-radius: 10px;
    text-shadow: 0 0 15px rgba(0, 0, 0, 0.9);
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    margin-top: 20px;
  }

  .btn-reject {
    flex: 1;
    padding: 18px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
  }
  
  .btn-reject:hover { 
    border-color: #ff6b6b; 
    color: #ff6b6b; 
    background: rgba(255, 68, 68, 0.1);
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
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    border: 2px solid #FCF6BA;
    border-bottom: 3px solid #8B6508;
    color: #1a0b2e;
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.6), inset 0 1px 0 rgba(255,255,255,0.6);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  }

  .btn-validate:hover { 
    filter: brightness(1.1);
    transform: translateY(-3px); 
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.9), inset 0 1px 0 rgba(255,255,255,0.8);
  }

  .examples-section {
    margin-top: 40px;
    padding: 30px;
  }

  .section-title {
    font-size: 1.6rem;
    margin-bottom: 25px;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  }

  .examples-grid-full {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .example-item {
    aspect-ratio: 16/9;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .example-item:hover {
    border-color: rgba(191, 149, 63, 0.5);
    background: rgba(191, 149, 63, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  }

  .faq-section {
    margin-top: 40px;
    padding: 30px;
    margin-bottom: 40px;
  }

  .faq-item {
    margin-bottom: 25px;
    padding: 20px;
    border-radius: 12px;
  }

  .faq-item h3 {
    margin-bottom: 12px;
    font-weight: 700;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  }

  .faq-item p {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.7;
    font-size: 0.95rem;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  .faq-item strong {
    font-weight: 700;
  }

  .chat-response {
    margin-top: 20px;
  }
  
  .chat-bubble {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 14px;
    padding: 20px;
    color: #f0f0f5;
    font-size: 1rem;
    line-height: 1.7;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .download-btn {
    display: block;
    text-align: center;
    margin-top: 20px;
    padding: 18px;
    border-radius: 14px;
    font-weight: 900;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    border: 2px solid #FCF6BA;
    border-bottom: 3px solid #8B6508;
    color: #1a0b2e;
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.6), inset 0 1px 0 rgba(255,255,255,0.6);
    text-shadow: 0 1px 0 rgba(255,255,255,0.4);
    transition: all 0.3s ease;
  }
  
  .download-btn:hover { 
    filter: brightness(1.1); 
    transform: translateY(-3px); 
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.9), inset 0 1px 0 rgba(255,255,255,0.8);
  }

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

    .studio-page {
      background-attachment: scroll;
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
