<svelte:head>
  <title>Contact - ClipLumia</title>
</svelte:head>

<div class="legal-page">
  <div class="container">
    <h1 class="gold-chrome">Contactez-nous</h1>
    
    <div class="carte">
      <h2>Une question ? Un projet ?</h2>
      <p>Notre équipe vous répond sous 24h ouvrées.</p>
      
      <hr />
      
      <h2>Email</h2>
      <p><a href="mailto:contact.cliplumia@gmail.com" class="gold-link">contact.cliplumia@gmail.com</a></p>
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
    max-width: 900px;
    margin: 0 auto;
  }
  
  .gold-chrome {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 3rem;
    font-weight: 900;
    text-align: center;
    margin: 0 0 3rem 0;
    filter: drop-shadow(0 0 30px rgba(191, 149, 63, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }
  
  .carte {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.5);
    border-radius: 16px;
    padding: 3rem;
    backdrop-filter: blur(10px);
    text-align: center;
  }
  
  h2 {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 1rem;
    font-weight: 700;
  }
  
  p {
    color: #fff;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  hr {
    border: none;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(191, 149, 63, 0.5), transparent);
    margin: 2rem 0;
  }
  
  .gold-link {
    background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.2rem;
  }
  
  .gold-link:hover {
    filter: drop-shadow(0 0 15px rgba(252, 246, 186, 0.8));
  }
</style>
