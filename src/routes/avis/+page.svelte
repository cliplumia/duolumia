<script>
  import { page } from '$app/stores';

  const uid = $page.url.searchParams.get('uid') || '';

  let note = 5;
  let commentaire = '';
  let autorisePublication = true;
  let envoye = false;
  let erreur = '';
  let envoiEnCours = false;

  async function envoyer() {
    if (!uid) {
      erreur = "Lien invalide, impossible d'identifier votre compte.";
      return;
    }
    envoiEnCours = true;
    erreur = '';
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, note, commentaire, autorisePublication })
      });
      if (!res.ok) throw new Error();
      envoye = true;
    } catch {
      erreur = "Une erreur est survenue, réessayez dans un instant.";
    } finally {
      envoiEnCours = false;
    }
  }
</script>

<svelte:head>
  <title>Votre avis - ClipLumia</title>
</svelte:head>

<div class="legal-page">
  <div class="container">
    <h1 class="gold-chrome">Votre avis compte pour nous 💜</h1>

    <div class="carte">
      {#if envoye}
        <h2>Merci beaucoup 🙏</h2>
        <p>Votre avis a bien été enregistré, et ça nous aide énormément à avancer.</p>
      {:else}
        <p>
          Qu'avez-vous pensé de votre expérience sur ClipLumia ? Positif ou négatif, chaque retour
          nous aide à améliorer le site. N'hésitez pas à être honnête 😊
        </p>

        <div class="champ">
          <label for="note">Votre note</label>
          <select id="note" bind:value={note}>
            <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
            <option value={4}>⭐⭐⭐⭐ Très bien</option>
            <option value={3}>⭐⭐⭐ Correct</option>
            <option value={2}>⭐⭐ Décevant</option>
            <option value={1}>⭐ Mauvais</option>
          </select>
        </div>

        <div class="champ">
          <label for="commentaire">Votre commentaire</label>
          <textarea
            id="commentaire"
            bind:value={commentaire}
            rows="5"
            placeholder="Dites-nous tout, même si c'est négatif, ça nous aide à progresser !"
          ></textarea>
        </div>

        <label class="case">
          <input type="checkbox" bind:checked={autorisePublication} />
          J'accepte que mon avis soit affiché sur le site ClipLumia
        </label>
        <p class="precision">
          Rassurez-vous : seul votre prénom pourra être affiché, jamais votre email ni votre nom complet.
        </p>

        {#if erreur}
          <p class="erreur">{erreur}</p>
        {/if}

        <button class="bouton-or" on:click={envoyer} disabled={envoiEnCours}>
          {envoiEnCours ? 'Envoi...' : 'Envoyer mon avis'}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: radial-gradient(ellipse at top, #5a3696 0%, #3d206b 50%, #2d1b4e 100%);
    background-attachment: fixed;
    color: #fff;
    min-height: 100vh;
  }

  .legal-page {
    min-height: 100vh;
    padding: 4rem 1rem;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
  }

  .gold-chrome {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.2rem;
    font-weight: 900;
    text-align: center;
    margin: 0 0 3rem 0;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }

  .carte {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.5);
    border-radius: 16px;
    padding: 2.5rem;
    backdrop-filter: blur(10px);
  }

  h2 {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem;
    margin-top: 0;
    font-weight: 700;
  }

  p {
    color: #fff;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .champ {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  select, textarea {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(191, 149, 63, 0.4);
    border-radius: 8px;
    padding: 0.75rem;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
  }

  .case {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 400;
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  .case input {
    width: 18px;
    height: 18px;
  }

  .precision {
    font-size: 0.85rem;
    color: #cbb8ea;
    margin: -1rem 0 1.5rem 0;
    line-height: 1.5;
  }

  .erreur {
    color: #ff8a8a;
  }

  .bouton-or {
    width: 100%;
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    color: #2d1b4e;
    border: none;
    border-radius: 8px;
    padding: 0.9rem;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
  }

  .bouton-or:disabled {
    opacity: 0.6;
    cursor: default;
  }
</style>
