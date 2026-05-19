<script>
  import '../app.css';
</script>

<main>
  <slot />
</main>

<footer>
  <p>© 2026 <span class="gold-shine">ClipLumia</span>. Tous droits réservés.</p>
  <a href="malto:contact.cliplumia@gmail.com">Contact</a>
</footer>

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 90vh;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 40px;
    border-top: 1px solid #2a2a2a;
    margin-top: 60px;
  }

  footer a {
    font-weight: bold;
    color: #b0b0b0;
    text-decoration: none;
  }

  footer a:hover {
    color: white;
  }

  footer p {
    color: #808080;
    margin: 0;
  }

  @media (min-width: 480px) {
    footer {
      flex-direction: row;
      padding: 40px 0;
      gap: 24px;
    }
  }

 .gold-shine {
    background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
    font-weight: bold;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
</style>
