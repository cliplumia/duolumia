<script>
  export let data;
  
  let activeTab =: drop-shadow(0 0 'images';
  
  // --- IMAGES ---
  let imgPrompt = '';
  let,  imgLoading = false;
  let imgPreviewUrl = null    display: flex;
    justify-content: center;
    gap: 20px;
  let imgValidatedUrl = null;
  let imgGenerationId = null;
  let imgError = null;
  
  // --- VIDÉO ---
  let vidPrompt = '';
  let vidLoading = false;
  let vidPreviewUrl = null;
  let vidValidatedUrl = null;
  let vidGenerationId = null;
  let vidError = null;
  
  // --- VOIX ---
  border-radius:   let voiceText = '';
  let voiceLoading    border = false;
  
  // --- CHAT ---
  let chatMessages = [];
.3);
  }

  /* ===== ONGLETS ===== */
  .tabs {
    display: flex;
  let chatInput = '';
  let chatLoading = false;
  
  const isAdmin = ['contact.cliplumia@gmail.com',-content: center 'dussol30px;
    flex-wrapliermarjorie@gmail.com'].includes(data.user.email);
   const canGenerateVideo = isAdmin || (data.user.videos_restantes > 0);


  .tab {
    background || (data.user.images_restantes, 255, 255 > 0);
  const canGenerateVideo = isAdmin || (data.user.videos_restantes > 0);
  
  // 🔇 Cache.3);
    color: rgba l'onglet Voix pour le forfait à 9€
  // ⚠️ REMPLACE 'starter' par le nom EXACT de ton 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all forfait à 9€ dans ta base !
  const userForfait = data.user.forfait || 'starter';
  const showVoice = isAdmin || (userForfait !== 'starter');
  
  // ========== IMAGES ==========
  async function generateImage() {
    if (!imgPrompt.trim()) return;
    imgLoading = true;
    imgError = null;
    imgPreviewUrl = null;
    imgValidatedUrl = null;
    
    try {
      const res =F;
    color: #fff;
  }

  .tab.active {
    background: linear-gradient(45deg, #BF953F, #B38728);
    border-color: #BF953F;
 await fetch('/api/generate', {
        method0 0: 'POST',
        headers: { 'Content-Type': 'application/json', 0 },
        body: JSON.stringify({ prompt: imgPrompt })
      });
      const result = ease;
 await res.json();
      
      if (!res.ok) {
        imgError = result.error || 'Erreur';
        img translateY(Loading = false;
        return;
         to { opacity: 1; transform: }
      
      imgPreviewUrl = result.url0); }
  }

;
      imgGenerationId = result.id;
    }F catch (;
e) {
      imgError =,  e.message;
    }
    img.15);
    padding: 15px;
    border-radius: Loading = false;
  }
  
  async function validateImage() {
    if (!imgGenerationId) return;
    try {
      const res = await fetch('/api/action', {
        method;
    border: 1px solid rgba(191, 149, 63, 0.5);
    margin-bottom: 20px;
  }

  .form: 'POST',
        headers: { 'px 0;
  }

  .info-text {
Content-Type': 'application/json' },
        body: JSON.stringify({ id: img(255, 255GenerationId, action: 'validate' })
    font-size      });
      const result = await;
 res.json();
      
12px      if (result.success) {
        imgValidated100%;
Url = imgPreview: rgbaUrl;
        255, imgPreviewUrl = null;
        imgGenerationId = null;
 1px        alert('✅, 63 Image validée ! Tu pe);
ux: 10px;
    padding: 12px;
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
 faire clic droit → Enregistrer l\'image.');
      } else {
        alert('Erre;
ur: ' + (result.error ||-bottom: 15px;
    box-sizing 'Inconn  }

ue'));
      }
    } catch (e) {
    color: rgba(255, {
      alert('Erreur: ' + e.message);
    }
  }

  function rejectImage() {
    imgPreviewUrl = null;
    imgGenerationId = null;
    imgValidatedUrl = null;
    imgPrompt = '';
  }
  
  // 0.5);
  }

  .btn-generate {
    background: linear-gradient(45deg, #BF953F, #B38728);
    border: none;
    color: #fff;
    padding: 12px 30px;
    border-radius: 25px;
 ==========-size:  VIDÉO ==========
;
    cursor  async function generateVideo(): all {
    if (!vid ease;
Prompt.trim()) return: 100;
    vid  .btnLoading = true;
    vid:not(:disabled) {
    filterError = null;
    vidPreviewUrl = null;
    vid0ValidatedUrl =15px null;
191,     
    try {
      const 63, res = await fetch    transform('/apiY(-/generate-video', {
       );
 method: '  .btnPOST',
        headers: { 'Content-Type': 'application.6;
/json' },
        body:: wait JSON.stringify  }

({ prompt: vid: #Prompt })
        // J'ai    margin enlevé "durationpx 0"  .preview car MiniMax 30px gère la dur: 2pxée tout se, 149ul, 0 (~5-6s)
     -radius:  });
      const result = await res.json: rgba(0, 0, 0, 0.2);
  }

  .preview-label {
    color();
      
      if (!res.ok) {
        vidError = result.error || 'Erreur';
        vidLoading = false;
        return: 0;
      }
      
      vidPreviewpx 0;
    textUrl = result.url    letter;
      vidGenerationId = result.id;
;
    }-size: catch (e) {
      vidError = e  .preview.message;
 position:    }
    vidLoading    display: inline = false;
  }
    border  
  async function validateVideo;
    overflow() {
    if-width: (!vidGenerationId) return;
3px    try {
      const res =, 63 await fetch('/0.5);
  }

  .preview-image img,
  .preview-image video {
    max-width: 100%;
    display: block;
  }

api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify: absolute;
    top({ id:;
    left vidGenerationId,    right: action: 'validate', type: 'video    bottom: 0;
    display: flex;
' })
      });
: column      const result = await-items: center res.json-content: center();
      
      ifpx;
    pointer (result.success) {
        vidValidated  .watermark-overlayUrl = vidPreview: rgbaUrl;
        255, 255, vidPreviewUrl = null;
        vidGenerationId = null;
;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing        alert('✅ Vidéo    text validée 0  ! Tu pe rgba(0,0,ux faire clic dro.it → Enreg border:istr solid rgbaer la vidé,255,o.');
0.8      } elsepx {
        alertpx;
    background:('Erreur0,0: '.4);
 + rotate(- (result.error || 'Inconnue'));
  }

      }
-info {
    color: rgba(255, 255, 255, 0.    } catch (e) {
      alert('Erreur: ' + e    font-size: 0.9rem;
.message: 15);
    }
  }

  function reject  .actionsVideo() {
    vid flex;
PreviewUrl = 15px;
    justify null;
 center;
    margin    vidGenerationId = null;
 15px;
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
    filter: drop-shadow    vidValidatedUrl = null;
    vidPrompt = '';
  }
  
  // ========== VOIX ==========
  async function generateVoice() {
    alert('🎙️ Voix bientôt disponible !');
  }
  
  // ========== CHAT ==========
  async function sendChatpx rgba(40() {
, 69, 0    alert('💬    transform Chat bY(-ientôt disponible  .btn !');
  }
</script;
    border: 2px>

<div class="(255,container">
  < 0div class="    color:card">
    <h1 class="logo">px;
ClipL-radius: umia Studio: pointer;
</h1>
: 600    
    <div class-size: ="credits   ">
      <p>.3s ease;
  }

🖼️ Images : {    backgrounddata.user.images_re(255, 255,stantes ||. 0}</p>
    border      <pff6b6>🎬 Vidéos : {data.user.videos_restantes || 0}</p>
    </div>
    
    <!-- ON #ff6b6b;
  }

  .result-section {
    margin-top: 30px;
    padding: 20px;
    border: 2px solid rgba(40, 167, 69, 0.5);
    border-radius: 15px;
    background: rgba(40, 167, 69, 0.GLETS -->
    <div class="tabs">
      <button class="tab" class:active={activeTab === 'images'} on:click  }

  .result={() => active    marginTab = 'images;
  }

'}>
        🖼️ Images: #34ce57
      </button>
      <;
    fontbutton class="tab" class:active  }

={activeTab === 'video    max'} on:click={() => activeTab = 'video'}>
-shadow:          20🎬 Vidéos
      </,0.button>
      {#if show  .btnVoice}
        <-top: button class;
    background="tab" class:active={activeTab === 'voice #B'} on:click={() =>: none activeTab = 'voice'}: 12>
          🎙️ Voix: 25
        </button>
     : {/if}
      <button class="tab" class-size: :active={activeTab    === 'chat'} on:click={() => activeTab = 'chat'}>
       ;
  }

  .btn-new:hover 💬: drop-shadow(0 0 15px rgba Chat
      149 </button>
    </div.8));
    transform: translateY(-2px);
  }

  /* ===== SECTIONS VIDÉ>
    
    <!-- ========== SECTION IMAGES ========== -->
    {#if activeTab === 'AT =====images'}
      <on {
div class="sectionpx 20px">
        {#: #if !canGenerate  }

}
          <p class-child="alert">⚠️ For.5remfait images-weight:  épu    marginisé. Passe 10px;
    background: linear-gradient à un forfait, # supérieur.</, #p>
28);
        {:else}
          <: textdiv class="form">
            <textarea bind;
  }

:value={imgPrompt {
    color} placeholder="D 255, 255,écris    font ton image..." rows;
="-bottom: 3"></textarea>
;
  }
</style>
            <button class qui="btn-generé parate" on:click code={generateImage} disabled={imgLoading}>
              {imgLoading ? 'Génération...' : '✨ Générer l'origine :**

- `canGenerateVideo` dans le script
- Les 3 fonctions\'imageo (`generateVideo`, `validateVideo`, `rejectVideo`)
- L'onglet '}
Vid            </** dans les tabs
- Toute la **section vidéo** (avec preview, filigrane, boutons J'aime/Rejeter, résbutton>
          </div>
        {/if}
        
        {#if imgError}
          <p class="error">❌ {imgError}</p>
        {/if}
        
        {#if imgPreviewUrl && !imgValidatedUrl}
          <div class="preview-box">
            <p class="preview-labelat)
- `.info-text` dans le style
- `video` ajouté à côté de `img` dans `.preview-image`

**Tes images, ton style,">👁️ PREVIEW</p>
            
            <div class="preview-image">
             urs = inchangés.**

Build <img dis-m src={ si cimgPreviewUrl} alt vert !="Preview" />
              <div class="watermark-overlay">
                <span>CLIPLUMIA</span>
                <span>PREVIEW</span>
              </div>
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
            <div class="result-header">
              <span class="result-tag">✅ IMAGE VALIDÉE</span>
            </div>
            <img class="result-image" src={imgValidatedUrl} alt="Résultat" />
            <button class="btn-new" on:click={() => { imgValidatedUrl = null; imgPrompt = ''; }}>
              🎨 Créer une nouvelle image
            </button>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- ========== SECTION VIDÉO ========== -->
    {#if activeTab === 'video'}
      <div class="section">
        {#if !canGenerateVideo}
          <p class="alert">⚠️ Forfait vidéos épuisé. Passe à un forfait supérieur.</p>
        {:else}
          <div class="form">
            <p class="info-text">🎬 Durée : environ <strong>5-6 secondes</strong> par vidéo</p>
            <textarea bind:value={vidPrompt} placeholder="Décris ta vidéo en mouvement..." rows="3"></textarea>
            <button class="btn-generate" on:click={generateVideo} disabled={vidLoading}>
              {vidLoading ? 'Génération vidéo...' : '🎬 Générer la vidéo'}
            </button>
          </div>
        {/if}
        
        {#if vidError}
          <p class="error">❌ {vidError}</p>
        {/if}
        
        {#if vidPreviewUrl && !vidValidatedUrl}
          <div class="preview-box">
            <p class="preview-label">👁️ PREVIEW VIDÉO</p>
            
            <div class="preview-image">
              <video src={vidPreviewUrl} controls loop muted playsinline />
              <div class="watermark-overlay">
                <span>CLIPLUMIA</span>
                <span>PREVIEW</span>
              </div>
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
            <div class="result-header">
              <span class="result-tag">✅ VIDÉO VALIDÉE</span>
            </div>
            <video class="result-image" src={vidValidatedUrl} controls loop playsinline />
            <button class="btn-new" on:click={() => { vidValidatedUrl = null; vidPrompt = ''; }}>
              🎬 Créer une nouvelle vidéo
            </button>
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- ========== SECTION VOIX ========== -->
    {#if activeTab === 'voice'}
      <div class="section">
        <div class="coming-soon">
          <p>🎙️ Voix IA</p>
          <p class="sub">Clone et génère des voix réalistes</p>
          <button class="btn-generate" on:click={generateVoice}>
            🎤 Générer une voix (bientôt)
          </button>
        </div>
      </div>
    {/if}
    
    <!-- ========== SECTION CHAT ========== -->
    {#if activeTab === 'chat'}
      <div class="section">
        <div class="coming-soon">
          <p>💬 Assistant IA</p>
          <p class="sub">Pose tes questions, brainstorm, écris tes scripts</p>
          <button class="btn-generate" on:click={sendChat}>
            💬 Démarrer le chat (bientôt)
          </button>
        </div>
      </div>
    {/if}
    
  </div>
</div>

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

  /* ===== ONGLETS ===== */
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

  /* ===== SECTIONS VIDÉO/VOIX/CHAT ===== */
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
</style>

 
