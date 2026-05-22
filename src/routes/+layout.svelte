<script>
  import '../app.css';
</script>

<main>
  <slot />
</main>

<footer class="footer">
  <div class="footer-content">
    <p class="footer-mail">
      📧 <a href="mailto:Contact.cliplumia@gmail.com" class="gold-chrome">
        Contact.cliplumia@gmail.com
      </a>
    </p>
    
    <div class="footer-links">
      <a href="/mentions-legales">Mentions légales</a>
      <span>•</span>
      <a href="/cgv">CGV</a>
      <span>•</span>
      <a href="/contact">Contact</a>
    </div>
    
    <p class="footer-copy">
      © 2026 <span class="gold-chrome">Cliplumia</span> - Créé avec ❤️ par une créatrice
    </p>
  </div>
</footer>

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
    min-height: 90vh;
    padding: 1rem;
  }

  .footer {
    background: #2d1b4e; 
    padding: 3rem 1rem 2rem 1rem;
    margin-top: 5rem;
    text-align: center;
    border-top: 3px solid #BF953F;
    color: #fff;
  }
  
  .footer-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .footer-mail {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    font-family: 'Playfair Display', serif;
  }
  
  .footer-links {
    display: flex;
    gap: 1.2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  .footer-links a {
    color: #fff;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    color: #BF953F;
    text-decoration: underline;
  }
  
  .footer-links span {
    color: #BF953F;
    opacity: 0.6;
  }
  
  .footer-copy {
    color: #ccc;
    font-size: 0.85rem;
  }
</style>
