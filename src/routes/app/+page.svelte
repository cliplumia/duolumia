<script>
  import { onMount } from 'svelte';
  let prompt = '';
  let imageUrl = '';
  let chargement = false;
  let erreur = '';

  async function genererImage() {
    if (!prompt) {
      erreur = 'Écris un prompt chef';
      return;
    }
    
    chargement = true;
    erreur = '';
    imageUrl = '';

    const res = await fetch('/api/test-openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': 'Cliplumia-Spam-2026' // TON CODE SECRET ICI
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    
    if (res.ok) {
      imageUrl = data.url; // Change si ton API renvoie autre chose
    } else {
      erreur = data.error || 'Erreur serveur';
    }
    chargement = false;
  }
</script>

<svelte:head>
  <title>Cliplumia - Générer</title>
</svelte:head>

<section style="padding: 40px; max-width: 600px; margin: 0 auto; color: white;">
  <h1 style="font-size: 2rem; margin-bottom: 20px;">Génère ton image</h1>
  
  <textarea 
    bind:value={prompt} 
    placeholder="Décris ton image..." 
    style="width: 100%; padding: 10px; border-radius: 8px; margin-bottom: 15px; color: black;"
    rows="4"
  ></textarea>
  
  <button 
    on:click={genererImage} 
    disabled={chargement}
    style="background: gold chrome; color: black; padding: 15px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;"
  >
    {chargement ? 'Génération en cours...' : 'Générer l\'image'}
  </button>
  
  {#if erreur}
    <p style="color: #ff6b6b; margin-top: 15px;">❌ {erreur}</p>
  {/if}
  
  {#if imageUrl}
    <div style="margin-top: 20px;">
      <img src={imageUrl} alt="Image générée" style="max-width: 100%; border-radius: 8px;" />
    </div>
  {/if}
</section>

<style>
  :global(body) {
    background: #2d1b4e;
  }
</style>
