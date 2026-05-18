<section class="hero">
  <h1 class="logo-dore">ClipLumia</h1>
  <p class="sous-titre">Créez des vidéos et images IA d'exception sans crédits</p>
 
  <a href="/generer" class="btn-dore">Visiter le site</a>
</section>

<style>
  /* FOND BORDEAUX LUXE */
  :global(body) {
    background: #2C0B0E;
    color: #F5F5F4;
    margin: 0;
    font-family: 'Arial', sans-serif;
  }

  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    padding: 20px;
    background: radial-gradient(circle at 50% 50%, #4C1D1D, #2C0B0E);
  }

  /* LUEUR BORDEAUX */
  .hero::before {
    content: '';
    position: absolute;
    width: 800px;
    height: 800px;
    background: #8B0000;
    border-radius: 50%;
    filter: blur(150px);
    opacity: 0.15;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  /* TEXTE CLIPLUMIA DORÉ SCINTILLANT */
  .logo-dore {
    font-size: 80px;
    font-weight: 800;
    position: relative;
    z-index: 1;
    margin: 0;
    background: linear-gradient(
      90deg,
      #BF953F,
      #FCF6BA,
      #B38728,
      #FBF5B7,
      #AA771C
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: scintille 3s linear infinite;
    text-shadow: 0 0 30px rgba(191, 149, 63, 0.3);
  }

  @keyframes scintille {
    to { background-position: 200% center; }
  }

  /* BOUTON DORÉ EN BAS */
  .btn-dore {
    margin-top: 60px;
    padding: 16px 40px;
    font-size: 18px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    z-index: 1;
    background: linear-gradient(90deg, #BF953F, #AA771C);
    color: #2C0B0E;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 4px 20px rgba(191, 149, 63, 0.4);
    transition: all 0.3s ease;
  }

  .btn-dore:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(191, 149, 63, 0.6);
  }

  .sous-titre {
    font-size: 20px;
    color: #D6D3D1;
    margin-top: 20px;
    z-index: 1;
    max-width: 600px;
  }

  /* RESPONSIVE MOBILE */
  @media (max-width: 768px) {
    .logo-dore {
      font-size: 48px;
    }
    .sous-titre {
      font-size: 16px;
    }
    .btn-dore {
      padding: 14px 32px;
      font-size: 16px;
    }
  }
</style> 
