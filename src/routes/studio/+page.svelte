  <script>
  import { onMount } from 'svelte';

  export let data;

  // === BLOCAGE ENREGISTREMENT PAGE (Ctrl+S / Cmd+S) TANT QU'UN APERÇU EST AFFICHÉ ===
  onMount(() => {
    function blockSaveShortcut(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', blockSaveShortcut);
    return () => window.removeEventListener('keydown', blockSaveShortcut);
  });

// === ÉTAT DES SECTIONS ===
  let activeTab = 'images';

  // === IMAGES ===
  let imgPrompt = '';
  let imgLoading = false;
  let imgPreviewUrl = null;
  let imgValidatedUrl = null;
  let imgGenerationId = null;
  let imgDownloadUrl = null;
  let imgError = null;
  let imgFormat = '1:1';
  let imgStyle = 'realiste';
  
  // === VIDÉOS ===
  let vidPrompt = '';
  let vidLoading = false;
  let vidPreviewUrl = null;
  let vidValidatedUrl = null;
  let vidGenerationId = null;
  let vidDownloadUrl = null;
  let vidPlayer = null;
  let vidReplicateId = null;
  let vidInterval = null;
  let vidError = null;
  let vidFormat = '16:9';
  let vidStyle = 'cinematique';
  
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
  
 // === LIPSYNC ===
  let lipImageBase64 = '';
  let lipAudioUrl = '';
  let lipLoading = false;
  let lipPreviewUrl = null;
  let lipValidatedUrl = null;
  let lipDownloadUrl = null;
  let lipGenerationId = null;
  let lipError = null;
  let lipAudioSource = 'upload';
  let lipExpression = 'neutre';
  let lipType = 'parole';
  let lipPrompt = "La personne sur l'image parle naturellement, haute qualité";
  
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

  // === RESET QUAND ON CHANGE D'ONGLET ===
  $: {
    if (activeTab === 'images') {
      vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; lipValidatedUrl = ''; voiceAudioUrl = ''; chatResponse = ''; vidPrompt = ''; lipPrompt = ''; voiceText = ''; chatPrompt = '';
    } else if (activeTab === 'video') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; lipPreviewUrl = ''; lipValidatedUrl = ''; voiceAudioUrl = ''; chatResponse = ''; imgPrompt = ''; lipPrompt = ''; voiceText = ''; chatPrompt = '';
    } else if (activeTab === 'lipsync') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; voiceAudioUrl = ''; chatResponse = ''; imgPrompt = ''; vidPrompt = ''; voiceText = ''; chatPrompt = '';
    } else if (activeTab === 'voice') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; lipValidatedUrl = ''; chatResponse = ''; imgPrompt = ''; vidPrompt = ''; lipPrompt = ''; chatPrompt = '';
    } else if (activeTab === 'chat') {
      imgPreviewUrl = ''; imgValidatedUrl = ''; vidPreviewUrl = ''; vidValidatedUrl = ''; lipPreviewUrl = ''; lipValidatedUrl = ''; voiceAudioUrl = ''; imgPrompt = ''; vidPrompt = ''; lipPrompt = ''; chatPrompt = '';
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
      imgDownloadUrl = result.downloadUrl;
      imgPreviewUrl = null;
      imgGenerationId = null;
      data.user.images_restantes--; // ← AJOUTER CETTE LIGNE
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
          } else if (check.status === 'pending' && check.replicateId) {
            // Nouvelle tentative lancee automatiquement cote serveur
            vidReplicateId = check.replicateId;
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
      vidDownloadUrl = result.downloadUrl;
      vidPreviewUrl = null;
      vidGenerationId = null;
      data.user.videos_restantes--; // ← AJOUTER CETTE LIGNE
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
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      lipError = "Le fichier choisi n'est pas une image (" + (file.type || 'type inconnu') + "). Merci de choisir une photo (JPG, PNG, WEBP...).";
      event.target.value = '';
      return;
    }
    lipError = null;
    const reader = new FileReader();
    reader.onload = (e) => lipImageBase64 = e.target.result;
    reader.readAsDataURL(file);
  }

  // === UPLOAD AUDIO LIPSYNC ===
  function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      lipError = "Le fichier choisi n'est pas un son (" + (file.type || 'type inconnu') + "). Merci de choisir un fichier audio (MP3, WAV...).";
      event.target.value = '';
      return;
    }
    lipError = null;
    const reader = new FileReader();
    reader.onload = (e) => { lipAudioUrl = e.target.result; };
    reader.readAsDataURL(file);
  }

  // === FONCTION GÉNÉRATION LIPSYNC ===
  async function generateLipsync() {
    if (!lipImageBase64) {
      lipError = "Veuillez uploader une image";
      return;
    }
    
    lipLoading = true;
    lipError = null;
    lipPreviewUrl = null;
    
    try {
      const imageUploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64: lipImageBase64, fileType: 'image' })
      });
      const imageUploadData = await imageUploadRes.json();
      if (!imageUploadRes.ok || !imageUploadData.success) throw new Error(imageUploadData.error || 'Erreur upload image');
      const publicImageUrl = imageUploadData.url;

      let finalAudioUrl = '';

      if (lipAudioSource === 'upload') {
        if (!lipAudioUrl || !lipAudioUrl.startsWith('data:')) {
          throw new Error("Veuillez uploader un fichier audio valide");
        }
        const audioUploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64: lipAudioUrl, fileType: 'audio' })
        });
        const audioUploadData = await audioUploadRes.json();
        if (!audioUploadRes.ok || !audioUploadData.success) throw new Error(audioUploadData.error);
        finalAudioUrl = audioUploadData.url;

      } else if (lipAudioSource === 'url') {
        finalAudioUrl = lipAudioUrl;

      } else if (lipAudioSource === 'tts') {
        if (!lipAudioUrl) throw new Error("Veuillez entrer le texte à vocaliser");
        
        const voiceRes = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: lipAudioUrl, 
            speaker: 'Serena', 
            lang: 'French',
            emotion: ''
          })
        });
        const voiceData = await voiceRes.json();
        if (!voiceData.success) throw new Error("Erreur génération voix : " + (voiceData.error || "Inconnue"));
        finalAudioUrl = voiceData.url;
      }

      if (!finalAudioUrl) throw new Error("Aucune audio valide trouvée");

      const res = await fetch('/api/lipsync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: publicImageUrl,
          audio: finalAudioUrl,
          prompt: lipPrompt 
        })
      });
      
      const result = await res.json();
      
       if (res.ok && result.success) {
        lipPreviewUrl = result.url;
        lipGenerationId = result.id;
      } else {
        lipError = result.error || 'Erreur de génération';
      }
    } catch (e) {
      lipError = e.message;
    }
    
    lipLoading = false;
  }

  // === FONCTION VALIDATION LIPSYNC ===
  async function validateLipsync() {
    if (!lipGenerationId) return;
    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lipGenerationId, action: 'validate', type: 'video' })
      });
      const result = await res.json();
      
       if (result.success) {
        lipValidatedUrl = lipPreviewUrl;
        lipDownloadUrl = result.downloadUrl;
        lipPreviewUrl = null;
        lipGenerationId = null;
        data.user.videos_restantes--;
      } else {
        lipError = result.error || 'Erreur lors de la validation';
      }
    }catch (e) {
      lipError = e.message;
    }
  }

  // === FONCTION RESET LIPSYNC ===
  function resetLipsync() {
    lipImageBase64 = '';
    lipAudioUrl = '';
    lipPreviewUrl = null;
    lipValidatedUrl = null;
    lipError = null;
    lipPrompt = "La personne sur l'image parle naturellement, haute qualité";
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
          speaker: voiceSpeaker, 
          lang: voiceLang,
          emotion: voiceEmotion
        })
      });
      const result = await res.json();
      
      if (result.success) {
        voiceAudioUrl = result.url;
        if (!isAdmin) data.user.voices_restantes--;
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

      const result = await res.json();

      if (res.ok && result.success) {
        chatResponse = result.reply;
        if (!isAdmin) data.user.chat_restantes--;
      } else {
        chatResponse = '❌ Erreur : ' + (result.error || 'Impossible de générer la réponse');
      }
    } catch (e) {
      chatResponse = '❌ Erreur : ' + e.message;
    }
    chatLoading = false;
  }

// === FONCTION BLOQUER CLIC DROIT ===
function blockContextMenu(e) {
  e.preventDefault();
  return false;
 }
 function togglePlay(id) {
  const video = document.getElementById(id);
  if (video) {
    if (video.paused) video.play();
    else video.pause();
  }
 }

 async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/';
 }

</script>

<svelte:head>
  <title>Studio — ClipLumia</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="studio-page">
  <button type="button" class="logout-fixed glass" on:click={logout}><span class="chrome-gold-text">← Déconnexion</span></button>
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
      <button type="button" class="nav-item" class:active={activeTab === 'voice'} on:click={() => {
        if (data?.user?.plan === 'gratuit' || !data?.user?.plan) {
          if (confirm('🔒 Fonctionnalité réservée aux abonnés. Passez à un forfait pour accéder à la synthèse vocale. Aller à la page des forfaits ?')) {
            window.location.href = '/dashboard';
          }
          return;
        }
        activeTab = 'voice';
      }}>
        🎤 Voix IA {#if data?.user?.plan === 'gratuit' || !data?.user?.plan}<span class="lock-icon">🔒</span>{/if}
      </button>
      <button type="button" class="nav-item" class:active={activeTab === 'chat'} on:click={() => {
        if (data?.user?.plan === 'gratuit' || !data?.user?.plan) {
          if (confirm('🔒 Fonctionnalité réservée aux abonnés. Passez à un forfait pour accéder au Chat IA. Aller à la page des forfaits ?')) {
            window.location.href = '/dashboard';
          }
          return;
        }
        activeTab = 'chat';
      }}>
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
        <div class="forfait-badge chrome-gold">📸 {data?.user?.images_restantes || 0} | 🎬 {data?.user?.videos_restantes || 0} | 🎤 {data?.user?.voices_restantes || 0} | 💬 {data?.user?.chat_restantes || 0}</div>
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
          
        <button class="chrome-btn create-btn" on:click={generateImage} disabled={imgLoading || (!isAdmin && (data?.user?.images_restantes || 0) <= 0)}>
        {imgLoading ? '⏳ Génération en cours...' : "✨ CRÉER L'IMAGE"}
       </button>

          {#if !isAdmin && (data?.user?.images_restantes || 0) <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">
              ⚠️ Vous avez utilisé vos 3 essais gratuits. <a href="/dashboard" style="color:#FCF6BA;">Passez à un forfait !</a>
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
          
         <button class="chrome-btn create-btn" on:click={generateVideo} disabled={vidLoading || (!isAdmin && (data?.user?.videos_restantes || 0) <= 0)}>
         {vidLoading ? '⏳ Génération en cours...' : '🎬 CRÉER LA VIDÉO'}
         </button>

          {#if !isAdmin && (data?.user?.videos_restantes || 0) <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">
              ⚠️ Vous avez utilisé vos 3 essais gratuits. <a href="/dashboard" style="color:#FCF6BA;">Passez à un forfait !</a>
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
        <label for="lip-prompt">Description du mouvement (Prompt)</label>
         <textarea 
          id="lip-prompt" 
          bind:value={lipPrompt} 
          placeholder="Ex: La personne parle naturellement, haute qualité..."
          class="text-input"
          style="min-height: 100px;"
          ></textarea>
         </div>

          <div class="input-group">
            <label for="lip-audio-file">2. Fichier Audio</label>
            <input id="lip-audio-file" type="file" accept="audio/*" on:change={handleAudioUpload} class="file-input" />
          </div>

          <div class="options-grid">
            <div class="option-group">
              <label for="lip-expression">Expression</label>
              <select id="lip-expression" bind:value={lipExpression}>
                <option value="neutre">Neutre</option>
                <option value="souriant">Souriant</option>
                <option value="serieux">Sérieux</option>
                <option value="intense">Intense</option>
              </select>
            </div>
            <div class="option-group">
              <label for="lip-type">Type</label>
              <select id="lip-type" bind:value={lipType}>
                <option value="parole">Parole</option>
                <option value="chant">Chant</option>
                <option value="danse">Danse</option>
              </select>
            </div>
          </div>
          
          <button class="chrome-btn create-btn" on:click={generateLipsync} disabled={lipLoading || (!isAdmin && (data?.user?.videos_restantes || 0) <= 0)}>
            {lipLoading ? '⏳ Génération...' : '👄 CRÉER LE LIPSYNC'}
          </button>

          {#if !isAdmin && (data?.user?.videos_restantes || 0) <= 0}
            <p style="text-align:center; color:#ff6b6b; margin-top:10px; font-size:0.9rem;">⚠️ Essais gratuits utilisés. <a href="/dashboard" style="color:#FCF6BA;">Passez à un forfait !</a></p>
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
      </div>

<!-- ZONE DE PRÉVISUALISATION -->
{#if activeTab !== 'chat'}
  {#if imgPreviewUrl || imgValidatedUrl || vidPreviewUrl || vidValidatedUrl || voiceAudioUrl || lipPreviewUrl || lipValidatedUrl}
    <div class="preview-card glass" on:contextmenu={blockContextMenu}>
      <div class="preview-label">VOTRE CRÉATION</div>
      
      {#if imgPreviewUrl}
        <div class="preview-media"><img src={imgPreviewUrl} alt="Preview" on:contextmenu={blockContextMenu} /></div>
        <div class="watermark">CLIPLUMIA · PREVIEW</div>
        <div class="action-buttons">
          <button class="btn-reject" on:click={rejectImage}>❌ Rejeter (0€)</button>
          <button class="btn-validate" on:click={validateImage}>✅ J'aime</button>
        </div>
      {:else if imgValidatedUrl}
        <div class="preview-media validated"><img src={imgValidatedUrl} alt="Validated" /></div>
        {#if imgDownloadUrl}
          <a href={imgDownloadUrl} download="cliplumia-creation.webp" class="download-btn">️⬇️ TÉLÉCHARGER L'IMAGE</a>
        {/if}
      {:else if vidPreviewUrl}
        <div class="preview-media custom-video-wrapper">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video id="preview-vid" src={vidPreviewUrl} loop muted playsinline disablepictureinpicture disableRemotePlayback controlsList="nodownload noplaybackrate" on:contextmenu={blockContextMenu}></video>
          <button class="custom-play-btn" on:click={() => togglePlay('preview-vid')}>▶</button>
        </div>
        <div class="watermark">CLIPLUMIA · PREVIEW</div>
        <div class="action-buttons">
          <button class="btn-reject" on:click={rejectVideo}>❌ Rejeter (0€)</button>
          <button class="btn-validate" on:click={validateVideo}>✅ J'aime</button>
        </div>
      {:else if vidValidatedUrl}
        <div class="preview-media validated">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video src={vidValidatedUrl} controls loop playsinline></video>
        </div>
        {#if vidDownloadUrl}
          <a href={vidDownloadUrl} download="cliplumia-video.mp4" class="download-btn">⬇️ TÉLÉCHARGER LA VIDÉO</a>
        {/if}
      {:else if voiceAudioUrl}
        <div class="preview-media audio-player"><audio src={voiceAudioUrl} controls></audio></div>
      {:else if lipPreviewUrl}
        <div class="preview-media custom-video-wrapper">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video id="preview-lip" src={lipPreviewUrl} loop playsinline disablepictureinpicture disableRemotePlayback controlsList="nodownload noplaybackrate" on:contextmenu={blockContextMenu}></video>
          <button class="custom-play-btn" on:click={() => togglePlay('preview-lip')}>▶</button>
        </div>
        <div class="watermark">CLIPLUMIA · PREVIEW</div>
        <div class="action-buttons">
          <button class="btn-reject" on:click={resetLipsync}>❌ Rejeter (0€)</button>
          <button class="btn-validate" on:click={validateLipsync}>✅ J'aime</button>
        </div>
      {:else if lipValidatedUrl}
        <div class="preview-media validated">
          <!-- svelte-ignore a11y_media_has_caption -->
          <video src={lipValidatedUrl} controls loop playsinline></video>
        </div>
       <a href={lipDownloadUrl} download="lipsync-cliplumia.mp4" class="download-btn">⬇️ TÉLÉCHARGER LA VIDÉO</a>
      {/if}
    </div>
  {/if}
{/if}


      <!-- GALERIE D'EXEMPLES -->
      <div class="examples-section glass">
        <h2 class="chrome-text section-title">Exemples de Réalisations</h2>
        <p class="examples-intro">De vraies créations faites avec ClipLumia, avec le mode d'emploi pour les reproduire. 👇</p>
        <div class="examples-grid-full">

          <!-- IMAGE -->
          <div class="example-card">
            <div class="example-media">
              <img src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/LOUP.webp" alt="Image IA - loup réaliste" loading="lazy" />
            </div>
            <div class="example-guide">
              <h3>🖼️ Image IA</h3>
              <p class="guide-title">📝 Comment j'ai créé cette image</p>
              <ol>
                <li>Studio → outil <strong>Images IA</strong></li>
                <li>Je décris mon idée (ici un <strong>loup</strong> dans une forêt brumeuse), en précisant le <strong>style réaliste</strong> et le format</li>
                <li>Je génère → j'obtiens un aperçu avec filigrane</li>
                <li>Si j'aime → <strong>je valide ✅</strong> et je télécharge en HD</li>
              </ol>
            </div>
          </div>

          <!-- VIDEO -->
          <div class="example-card">
            <div class="example-media">
              <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/video%20ville%20vide.mp4" controls loop playsinline preload="metadata"></video>
            </div>
            <div class="example-guide">
              <h3>▶️ Vidéo IA</h3>
              <p class="guide-title">📝 Comment j'ai créé cette vidéo</p>
              <ol>
                <li>Studio → outil <strong>Vidéos IA</strong></li>
                <li>Je décris la scène et le <strong>mouvement</strong> (ici un survol de ville, ambiance cinéma)</li>
                <li>Je choisis le format, je génère → aperçu avec filigrane</li>
                <li>Si j'aime → <strong>je valide ✅</strong></li>
              </ol>
            </div>
          </div>

          <!-- LIPSYNC 1 (homme FR) -->
          <div class="example-card">
            <div class="example-media">
              <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/VIDEO%20HOMME%20D%20AFFAIRE.mp4" controls loop playsinline preload="metadata"></video>
            </div>
            <div class="example-guide">
              <h3>🎭 Lipsync IA</h3>
              <p class="guide-title">📝 Comment j'ai créé ce lipsync</p>
              <ol>
                <li><strong>D'abord, je crée ma voix</strong> dans l'onglet <strong>Voix IA</strong> (je tape mon texte, je choisis l'expression), puis je télécharge le fichier audio</li>
                <li>Je vais dans <strong>Lipsync</strong> → j'ajoute la <strong>photo du visage</strong></li>
                <li>Je charge mon <strong>fichier audio</strong> (étape « 2. Fichier Audio »)</li>
                <li>Je décris le mouvement (ex. « la personne parle naturellement, haute qualité »)</li>
                <li>Je clique sur <strong>Créer le lipsync</strong> → aperçu</li>
                <li>Si j'aime → <strong>je valide ✅</strong></li>
              </ol>
              <p class="example-tip">💡 Pour une pub pro : une belle voix + une musique libre de droit en fond.</p>
            </div>
          </div>

          <!-- LIPSYNC 2 (femme EN) -->
          <div class="example-card">
            <div class="example-media">
              <video src="https://pub-735f3b0c41604ae28dc263d976e80d1e.r2.dev/femme%20anglais%20presentation.mp4" controls loop playsinline preload="metadata"></video>
            </div>
            <div class="example-guide">
              <h3>🎭 Lipsync IA <span class="lang-badge">en anglais</span></h3>
              <p class="guide-title">📝 Même méthode que ci-dessus</p>
              <ol>
                <li>Ici, la voix a été créée <strong>en anglais</strong> : le lipsync fonctionne dans <strong>toutes les langues</strong></li>
                <li>Idéal pour des <strong>présentations pro</strong>, tutos ou pubs internationales</li>
              </ol>
              <p class="example-tip">💡 Parfait pour toucher des clients à l'international. 🌍</p>
            </div>
          </div>

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
          <p>C'est la force ClipLumia ! Si le résultat ne vous convient pas, cliquez sur <strong class="chrome-gold-text">"Rejeter (0€)"</strong> : vous ne payez rien et pouvez relancer une nouvelle création.</p>
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

        <div class="faq-item glass">
          <h3 class="chrome-gold-text">❓ Comment annuler mon abonnement ?</h3>
          <p>Depuis votre tableau de bord, cliquez sur "Gérer/Annuler mon abonnement". Vous gardez l'accès à votre forfait jusqu'à la fin de votre période déjà payée — pas de coupure immédiate, et pas de prélèvement le mois suivant.</p>
        </div>
      </div>

      <p class="studio-evolve">✨ ClipLumia grandit chaque jour : de nouvelles fonctionnalités arrivent régulièrement, à l'écoute de vos idées. ❤️</p>
    </main>
  </div>
</div>


<style>

/* === PROTECTION DES PRÉVISUALISATIONS === */
.preview-media img {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
}

.preview-media video {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.preview-media video::-webkit-media-controls-fullscreen-button {
  display: none;
}

.preview-media video::-webkit-media-controls {
  display: none !important;
}
 :global(*) { box-sizing: border-box; }
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    background-color: #0c0618;
    background-image: url('https://pub-6476d128f599432f96789b76ebbca25a.r2.dev/image%20fond%20page%20svelte.webp');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
  }
 :global(select) {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
}
:global(option) {
  background-color: #1a1a2e;
  color: #fff;
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
    margin-left: 8px;
    font-size: 0.9rem;
  }

  .studio-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 10px;
  }

  .studio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .studio-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin: 0;
  }

  .forfait-badge {
    padding: 12px 24px;
    border-radius: 50px;
    background: rgba(191, 149, 63, 0.15);
    border: 1px solid rgba(191, 149, 63, 0.3);
    font-weight: 600;
    font-size: 1.1rem;
  }

  .logout-fixed {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 50;
    border-radius: 50px;
    border: 1px solid rgba(191, 149, 63, 0.4);
    cursor: pointer;
    padding: 8px 18px;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    transition: all 0.3s ease;
  }

  .logout-fixed:hover {
    border-color: rgba(191, 149, 63, 0.9);
    box-shadow: 0 4px 15px rgba(191, 149, 63, 0.25);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .logout-fixed {
      top: 8px;
      right: 8px;
      font-size: 0.75rem;
      padding: 6px 14px;
    }
  }

  .generation-card {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  textarea, select, input[type="text"], input[type="file"] {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    color: #fff;
    padding: 12px 16px;
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
  }

  textarea:focus, select:focus, input[type="text"]:focus, input[type="file"]:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(191, 149, 63, 0.5);
    box-shadow: 0 0 15px rgba(191, 149, 63, 0.2);
  }

  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .option-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .option-group label {
    font-weight: 600;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);
  }

  .create-btn {
    padding: 16px 32px;
    font-size: 1.1rem;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;
  }

  .create-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .preview-card {
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .preview-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
  }

  .preview-media {
    position: relative;
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.3);
  }

  .custom-video-wrapper {
    position: relative;
  }

  .preview-media img, .preview-media video {
    width: 100%;
    height: auto;
    display: block;
  }

  .preview-media.validated {
    box-shadow: 0 0 40px rgba(76, 175, 80, 0.4);
  }

  .watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  font-size: 2rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.75);
  pointer-events: none;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.85),
    0 0 4px rgba(255, 255, 255, 0.85),
    1px 1px 0 rgba(255, 255, 255, 0.6),
    -1px -1px 0 rgba(255, 255, 255, 0.6);
  user-select: none;
}

  .action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    width: 100%;
  }

  .btn-reject, .btn-validate {
    padding: 14px 28px;
    border-radius: 10px;
    border: none;
    font-weight: 700;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .btn-reject {
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid rgba(255, 107, 107, 0.5);
    color: #ff6b6b;
  }

  .btn-reject:hover {
    background: rgba(255, 107, 107, 0.3);
    transform: translateY(-2px);
  }

  .btn-validate {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #1a0b2e;
    border: none;
  }

  .btn-validate:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  .download-btn {
    padding: 14px 28px;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #1a0b2e;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    display: inline-block;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .download-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  .audio-player {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: rgba(191, 149, 63, 0.1);
    border-radius: 12px;
  }

  .audio-player audio {
    width: 100%;
    max-width: 400px;
  }

  .chat-response {
    width: 100%;
    padding: 20px;
    background: rgba(191, 149, 63, 0.1);
    border-radius: 12px;
    margin-top: 20px;
  }

  .chat-bubble {
    color: #fff;
    font-size: 1rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .examples-section {
    padding: 40px;
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    margin: 0 0 30px 0;
  }

  .examples-intro {
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    margin: -15px 0 30px 0;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .examples-grid-full {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 24px;
    align-items: start;
  }

  .example-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
  }

  .example-card:hover {
    border-color: rgba(191, 149, 63, 0.4);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  }

  .example-media {
    width: 100%;
    background: #000;
    line-height: 0;
  }

  .example-media img,
  .example-media video {
    width: 100%;
    display: block;
    max-height: 400px;
    object-fit: contain;
    background: #000;
  }

  .example-guide {
    padding: 20px;
  }

  .example-guide h3 {
    margin: 0 0 12px 0;
    font-size: 1.15rem;
    color: #FCF6BA;
  }

  .lang-badge {
    font-size: 0.7rem;
    font-weight: 600;
    color: #FCF6BA;
    background: rgba(191, 149, 63, 0.12);
    border: 1px solid rgba(191, 149, 63, 0.3);
    border-radius: 100px;
    padding: 2px 10px;
    margin-left: 6px;
    vertical-align: middle;
  }

  .guide-title {
    font-weight: 600;
    margin: 0 0 8px 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
  }

  .example-guide ol {
    margin: 0;
    padding-left: 20px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .example-guide li {
    margin-bottom: 5px;
  }

  .example-guide li strong {
    color: #FCF6BA;
  }

  .example-tip {
    margin: 14px 0 0 0;
    font-size: 0.85rem;
    color: #FCF6BA;
    background: rgba(191, 149, 63, 0.08);
    border: 1px solid rgba(191, 149, 63, 0.2);
    border-radius: 8px;
    padding: 10px 12px;
    line-height: 1.5;
  }

  .faq-section {
    padding: 40px;
  }

  .studio-evolve {
    text-align: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 600px;
    margin: 30px auto 10px;
    line-height: 1.6;
  }

  .faq-item {
    padding: 24px;
    margin-bottom: 15px;
    border-left: 4px solid rgba(191, 149, 63, 0.5);
  }

  .faq-item h3 {
    margin: 0 0 12px 0;
    font-size: 1.1rem;
  }

  .faq-item p {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
  }

  .chrome-gold-text {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-group label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .file-input {
    padding: 12px;
  }

  .text-input {
    padding: 12px;
  }

   @media (max-width: 1024px) {
    .studio-container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      flex-direction: row;
      gap: 8px;
      padding: 12px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .nav-item {
      width: auto;
      flex-shrink: 0;
      white-space: nowrap;
      padding: 10px 16px;
    }

    .logo {
      display: none;
    }

    .studio-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    .studio-page {
      padding: 10px;
    }

    .generation-card, .preview-card, .faq-section, .examples-section {
      padding: 20px;
    }

    .studio-title {
      font-size: 1.5rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
    }

    .examples-grid-full {
      grid-template-columns: 1fr;
    }
  }
  .custom-play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #1a0b2e;
    border: 2px solid #FCF6BA;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    font-size: 24px;
    font-weight: 900;
    cursor: pointer;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(191, 149, 63, 0.6);
    transition: all 0.3s ease;
  }
   .custom-play-btn:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 30px rgba(191, 149, 63, 0.9);
  }
  
</style>
