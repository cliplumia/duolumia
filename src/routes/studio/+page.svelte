<script>
  export let data;
  
  let prompt = '';
  let loading = false;
  let previewUrl = null;
  let validatedUrl = null;
  let generationId = null;
  let error = null;
  
  const isAdmin = ['contact.cliplumia@gmail.com', 'dussolliermarjorie@gmail.com'].includes(data.user.email);
  const canGenerate = isAdmin || (data.user.images_restantes > 0);
  
  async function generate() {
    if (!prompt.trim()) return;
    loading = true;
    error = null;
    previewUrl = null;
    validatedUrl = null;
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const result = await res.json();
      
      if (!res.ok) {
        error = result.error || 'Erreur';
        loading = false;
        return;
      }
      
      previewUrl = result.url;
      generationId = result.id;
    } catch (e) {
      error = e.message;
    }
    loading = false;
  }
  
  async function valider() {
    if (!generationId) return;
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: generationId, action: 'validate' })
      });
      const result = await res.json();
      
      if (result.success) {
        validatedUrl = previewUrl;
        previewUrl = null;
        generationId = null;
        alert('✅ Image validée ! Tu peux faire clic droit → Enregistrer l\'image.');
      } else {
        alert('Erreur serveur: ' + (result.error || 'Inconnue'));
      }
    } catch (e) {
      alert('Erreur: ' + e.message);
    }
  }

  function rejeter() {
    previewUrl = null;
    generationId = null;
    validatedUrl = null;
    prompt = '';
  }
</script>

<div class="container">
  <div class="card">
    <h1 class="logo">ClipLumia Studio</h1>
    
    <div class="credits">
      <p>🖼️ Images : {data.user.images_restantes || 0}</p>
      <p>🎬 Vidéos : {data.user.videos_restantes || 0}</p>
    </div>
    
    {#if !canGenerate}
      <p class="alert">⚠️ Crédits épuisés. Passe à un forfait supérieur.</p>
    {:else}
      <div class="form">
        <textarea bind:value={prompt} placeholder="Décris ton image..." rows="3"></textarea>
        <button class="btn-generate" on:click={generate} disabled={loading}>
          {loading ? 'Génération...' : '✨ Générer'}
        </button>
      </div>
    {/if}
    
    {#if error}
      <p class="error">❌ {error}</p>
    {/if}
    
    {#if previewUrl && !validatedUrl}
      <div class="preview-box">
        <p class="preview-label">👁️ PREVIEW - FILIGRANE</p>
        
        <div class="preview-image">
          <img src={previewUrl} alt="Preview" referrerpolicy="no-referrer" />
          <div class="watermark-overlay">
            <span>CLIPLUMIA</span>
            <span>PREVIEW</span>
          </div>
        </div>
        
        <p class="preview-info">Valide pour recevoir la version HD sans filigrane</p>
        
        <div class="actions-preview">
          <button class="btn-validate" on:click={valider}>❤️ J'aime (1 crédit)</button>
          <button class="btn-reject" on:click={rejeter}>🗑️ Rejeter (0 crédit)</button>
        </div>
      </div>
    {/if}
    
    {#if validatedUrl}
      <div class="result-section">
        <div class="result-header">
          <span class="result-tag">✅ IMAGE VALIDÉE</span>
        </div>
        <img class="result-image" src={validatedUrl} alt="Résultat" />
        <button class="btn-new" on:click={() => { validatedUrl = null; prompt = ''; }}>
          🎨 Créer une nouvelle image
        </button>
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
    align-items: center;
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
    max-width: 600px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
    margin-bottom: 20px;
    color: #fff;
    font-size: 0.95rem;
  }

  .credits p {
    background: rgba(191, 149, 63, 0.2);
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid rgba(191, 149, 63, 0.3);
  }

  .alert {
    color: #FCF6BA;
    background: rgba(191, 149, 63, 0.15);
    padding: 15px;
    border-radius: 10px;
    border: 1px solid rgba(191, 149, 63, 0.5);
  }

  .form {
    margin: 20px 0;
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

  .preview-image img {
    max-width: 100%;
    display: block;
    filter: brightness(0.7);
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
</style>
