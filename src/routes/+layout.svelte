<script>
  import '../app.css';
</script>

<main>
  <slot />
</main>

<footer class="footer">
  <div class="footer-content">
    <p class="footer-mail">
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact.cliplumia@gmail.com" target="_blank">
  📧 contact.cliplumia@gmail.com
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

.footer-mail a {
  background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-decoration: none !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  cursor: pointer !important;
  display: inline-block !important;
  position: relative !important;
}

.footer-mail a::after {
  content: '' !important;
  position: absolute !important;
  left: 0 !important;
  bottom: -3px !important;
  width: 100% !important;
  height: 2px !important;
  background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728) !important;
}

.footer-mail a:hover {
  filter: drop-shadow(0 0 15px rgba(252, 246, 186, 0.8)) !important;
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
