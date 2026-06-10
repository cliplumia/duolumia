<script>
  export let data;
  
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
  let vidError = null;
  let vidReplicateId = null;
  let vidInterval = null;
  
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data.user.email);
  const canGenerate = isAdmin || (data.user.images_restantes > 0);
  const canGenerateVideo = isAdmin || (data.user.videos_restantes > 0);
  
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
        imgError = result.error || 'Erreur';
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
        alert('✅ Image validée ! Tu peux faire clic droit → Enregistrer l\'image.');
      } else {
        alert('Erreur: ' + (result.error || 'Inconnue'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
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
        vidError = result.error || 'Erreur';
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
            vidError = check.error || 'Generation echoue';
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
        alert('✅ Vidéo validée !');
      } else {
        alert('Erreur: ' + (result.error || 'Inconnue'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
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
  
  async function generateVoice() {
    alert('🎙️ Voix bientôt disponible !');
  }
  
  async function sendChat() {
    if (!chatInput.trim()) return;
    chatLoading = true;
    const userMsg = chatInput;
    chatMessages = [...chatMessages, { role: 'user', text: userMsg }];
    chatInput = '';
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const result = await res.json();
      
      if (result.success) {
        chatMessages = [...chatMessages, { role: 'bot', text: result.reply }];
      } else {
        chatMessages = [...chatMessages, { role: 'bot', text: '❌ Erreur: ' + (result.error || 'Inconnue') }];
      }
    } catch (e) {
      chatMessages = [...chatMessages, { role: 'bot', text: '❌ Erreur réseau' }];
    }
    chatLoading = false;
  }
  
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia Studio</h1>
    <div class="credits">
      <p>🖼️ Images : {data.user.images_restantes || 0}</p>
      <p>🎬 Vidéos : {data.user.videos_restantes || 0}</p>
    </div>
    <div class="tabs">
      <button class="tab" class:active={activeTab === 'images'} on:click={() => activeTab = 'images'}>🖼️ Images</button>
      <button class="tab" class:active={activeTab === 'video'} on:click={() => activeTab = 'video'}>🎬 Vidéos</button>
      <button class="tab" class:active={activeTab === 'voice'} on:click={() => activeTab = 'voice'}>🎙️ Voix</button>
      <button class="tab" class:active={activeTab === 'chat'} on:click={() => activeTab = 'chat'}>💬 Chat</button>
    </div>
    
    {#if activeTab === 'images'}
      <div class="section">
        {#if !canGenerate}
          <p class="alert">⚠️ Forfait images épuisé.</p>
        {:else}
          <div class="form">
            <textarea bind:value={imgPrompt} placeholder="Décris ton image..." rows="3"></textarea>
            <button class="btn-generate" on:click={generateImage} disabled={imgLoading}>{imgLoading ? 'Génération...' : '✨ Générer l\'image'}</button>
          </div>
        {/if}
        {#if imgError}<p class="error">❌ {imgError}</p>{/if}
        {#if imgPreviewUrl && !imgValidatedUrl}
          <div class="preview-box">
            <p class="preview-label">👁️ PREVIEW</p>
            <div class="preview-image">
              <img src={imgPreviewUrl} alt="Preview" />
              <div class="watermark-overlay"><span>CLIPLUMIA</span><span>PREVIEW</span></div>
            </div>
            <p class="preview-info">Valide pour recevoir la version HD sans filigrane</p>
            <div class="actions-preview">
              <button class="btn-validate" on:click={validateImage}>❤️ J'aime (1 sur forfait)</button>
              <button class="btn-reject" on:click={rejectImage}>🗑️ Rejeter (0 sur forfait)</button>
            </div>
          </div>
        {/if}
        {#if imgValidatedUrl}
          <div class="result-section">
            <div class="result-header"><span class="result-tag">✅ IMAGE VALIDÉE</span></div>
            <img class="result-image" src={imgValidatedUrl} alt="Résultat" />
            <button class="btn-new" on:click={() => { imgValidatedUrl = null; imgPrompt = ''; }}>🎨 Créer une nouvelle image</button>
          </div>
        {/if}
      </div>
    {/if}
    
    {#if activeTab === 'video'}
      <div class="section">
        {#if !canGenerateVideo}
          <p class="alert">⚠️ Forfait vidéos épuisé.</p>
        {:else}
          <div class="form">
            <p class="info-text">🎬 Durée : environ <strong>5-6 secondes</strong></p>
            <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo en mouvement..." rows="3"></textarea>
            <button class="btn-generate" on:click={generateVideo} disabled={vidLoading}>{vidLoading ? '⏳ Génération en cours...' : '🎬 Générer la vidéo'}</button>
            {#if vidLoading}<p class="info-text">⏳ Cela prend environ 30 à 60 secondes, ne quittez pas...</p>{/if}
          </div>
        {/if}
        {#if vidError}<p class="error">❌ {vidError}</p>{/if}
        {#if vidPreviewUrl && !vidValidatedUrl}
          <div class="preview-box">
            <p class="preview-label">👁️ PREVIEW VIDÉO</p>
            <div class="preview-image">
              <video src={vidPreviewUrl} controls loop muted playsinline />
              <div class="watermark-overlay"><span>CLIPLUMIA</span><span>PREVIEW</span></div>
            </div>
            <p class="preview-info">Valide pour recevoir la version HD sans filigrane</p>
            <div class="actions-preview">
              <button class="btn-validate" on:click={validateVideo}>❤️ J'aime (1 sur forfait)</button>
              <button class="btn-reject" on:click={rejectVideo}>🗑️ Rejeter (0 sur forfait)</button>
            </div>
          </div>
        {/if}
        {#if vidValidatedUrl}
          <div class="result-section">
            <div class="result-header"><span class="result-tag">✅ VIDÉO VALIDÉE</span></div>
            <video class="result-image" src={vidValidatedUrl} controls loop playsinline />
            <button class="btn-new" on:click={() => { vidValidatedUrl = null; vidPrompt = ''; }}>🎬 Créer une nouvelle vidéo</button>
          </div>
        {/if}
      </div>
    {/if}
    
    {#if activeTab === 'voice'}
      <div class="section">
        <div class="coming-soon">
          <p>🎙️ Voix IA</p>
          <p class="sub">Clone et génère des voix réalistes</p>
          <button class="btn-generate" on:click={generateVoice}>🎤 Générer une voix (bientôt)</button>
        </div>
      </div>
    {/if}
    
       {#if activeTab === 'chat'}
      <div class="section">
        <div class="chat-box">
          {#each chatMessages as msg}
            <div class="chat-msg {msg.role}">
              <span class="chat-avatar">{msg.role === 'user' ? '🧑' : '🤖'}</span>
              <div class="chat-bubble">{msg.text}</div>
            </div>
          {/each}
          {#if chatLoading}
            <div class="chat-msg bot">
              <span class="chat-avatar">🤖</span>
              <div class="chat-bubble loading">Réflexion en cours...</div>
            </div>
          {/if}
        </div>
        <div class="chat-form">
          <textarea bind:value={chatInput} placeholder="Pose ta question, demande des idées de script..." rows="2" on:keydown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChat())}></textarea>
          <button class="btn-generate" on:click={sendChat} disabled={chatLoading}>{chatLoading ? '...' : '💬 Envoyer'}</button>
        </div>
      </div>
    {/if}

<style>
  .container {
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d206b 50%, #2d1b4e 100%);
    background-attachment: fixed;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px;
    font-family: 'Arial', sans-serif;
  }

  .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    max-width: 700px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-top: 20px;
  }

  .logo {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 20px 0;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 20px rgba(191, 149, 63, 0.8));
  }

  .credits {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 25px;
    color: #fff;
    font-size: 0.95rem;
  }

  .credits p {
    background: rgba(191, 149, 63, 0.2);
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid rgba(191, 149, 63, 0.3);
  }

  .tabs {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .tab {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.3);
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .tab:hover {
    border-color: #BF953F;
    color: #fff;
  }

  .tab.active {
    background: linear-gradient(45deg, #BF953F, #B38728);
    border-color: #BF953F;
    color: #fff;
    box-shadow: 0 0 15px rgba(191, 149, 63, 0.4);
  }

  .section {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .alert {
    color: #FCF6BA;
    background: rgba(191, 149, 63, 0.15);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(191, 149, 63, 0.5);
    margin-bottom: 20px;
  }

  .form {
    margin: 20px 0;
  }

  .info-text {
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    margin-bottom: 12px;
  }

  textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(191, 149, 63, 0.3);
    border-radius: 10px;
    padding: 12px;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 15px;
    box-sizing: border-box;
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .btn-generate {
    background: linear-gradient(45deg, #BF953F, #B38728);
    border: none;
    color: #fff;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
  }

  .btn-generate:hover:not(:disabled) {
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.8));
    transform: translateY(-2px);
  }

  .btn-generate:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .error {
    color: #ff6b6b;
    margin: 10px 0;
  }

  .preview-box {
    margin-top: 30px;
    padding: 20px;
    border: 2px dashed rgba(191, 149, 63, 0.5);
    border-radius: 15px;
    background: rgba(0, 0, 0, 0.2);
  }

  .preview-label {
    color: #FCF6BA;
    font-weight: bold;
    margin: 0 0 15px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.1rem;
  }

  .preview-image {
    position: relative;
    display: inline-block;
    border-radius: 10px;
    overflow: hidden;
    max-width: 100%;
    border: 3px solid rgba(191, 149, 63, 0.5);
  }

  .preview-image img,
  .preview-image video {
    max-width: 100%;
    display: block;
    border-radius: 10px;
  }

  .watermark-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    pointer-events: none;
  }

  .watermark-overlay span {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-shadow: 0 0 10px rgba(0,0,0,0.9);
    border: 2px solid rgba(255,255,255,0.8);
    padding: 5px 15px;
    background: rgba(0,0,0,0.4);
    transform: rotate(-15deg);
    opacity: 0.8;
  }

  .preview-info {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin: 15px 0;
  }

  .actions-preview {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 15px;
    flex-wrap: wrap;
  }

  .btn-validate {
    background: linear-gradient(45deg, #28a745, #34ce57);
    border: none;
    color: #fff;
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .btn-validate:hover {
    filter: drop-shadow(0 0 10px rgba(40, 167, 69, 0.6));
    transform: translateY(-2px);
  }

  .btn-reject {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .btn-reject:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  .result-section {
    margin-top: 30px;
    padding: 20px;
    border: 2px solid rgba(40, 167, 69, 0.5);
    border-radius: 15px;
    background: rgba(40, 167, 69, 0.1);
  }

  .result-header {
    margin-bottom: 15px;
  }

  .result-tag {
    color: #34ce57;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .result-image {
    max-width: 100%;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }

  .btn-new {
    margin-top: 20px;
    background: linear-gradient(45deg, #BF953F, #B38728);
    border: none;
    color: #fff;
    padding: 12px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .btn-new:hover {
    filter: drop-shadow(0 0 15px rgba(191, 149, 63, 0.8));
    transform: translateY(-2px);
  }

  .coming-soon {
    padding: 40px 20px;
    color: #fff;
  }

  .coming-soon p:first-child {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .coming-soon .sub {
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
    margin-bottom: 25px;
  }
 .chat-box {
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    background: rgba(0,0,0,0.2);
    border-radius: 16px;
    margin-bottom: 15px;
    text-align: left;
  }
  .chat-msg {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    align-items: flex-start;
  }
  .chat-msg.user {
    flex-direction: row-reverse;
  }
  .chat-avatar {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  .chat-bubble {
    background: rgba(191,149,63,0.15);
    border: 1px solid rgba(191,149,63,0.3);
    padding: 12px 16px;
    border-radius: 16px;
    color: #fff;
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 80%;
  }
  .chat-msg.user .chat-bubble {
    background: rgba(90,54,150,0.4);
    border-color: rgba(90,54,150,0.5);
  }
  .chat-bubble.loading {
    opacity: 0.7;
    font-style: italic;
  }
  .chat-form {
    display: flex;
    gap: 10px;
  }
  .chat-form textarea {
    flex: 1;
    margin-bottom: 0;
  }
  .chat-form .btn-generate {
    width: auto;
    padding: 12px 24px;
  }
</style>

