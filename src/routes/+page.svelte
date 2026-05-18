 import { onMount } from 'svelte';
  
  let canvas;
  
  onMount(() => {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedX: Math.random() * 0.15 - 0.075,
        speedY: Math.random() * 0.15 - 0.075,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  });
</script>

<canvas bind:this={canvas}></canvas>

<section class="hero">
  <div class="logo-container">
    <div class="anneau-horizontal"></div>
    <h1 class="logo-dore">ClipLumia</h1>
  </div>
  
  <p class="sous-titre">"Créez des vidéos et images IA d'exception sans crédits"</p>
</section>

<a href="/generer" class="btn-dore">Visiter le site</a>

<style>
  :global(body) {
    background: #0A0515;
    color: #F5F5F4;
    margin: 0;
    font-family: 'Georgia', serif;
    overflow: hidden;
  }

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
    padding: 20px;
    background: 
      radial-gradient(ellipse 150% 60% at 50% 0%, rgba(140, 50, 90, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 120% 80% at 50% 50%, rgba(90, 25, 120, 0.25) 0%, transparent 60%),
      linear-gradient(180deg, #1A0B2E 0%, #120815 50%, #0A0515 100%);
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -30%;
    width: 160%;
    height: 160%;
    background: radial-gradient(circle at 20% 30%, rgba(200, 70, 130, 0.12) 0%, transparent 35%);
    animation: reflet 20s ease-in-out infinite;
    z-index: 0;
  }

  @keyframes reflet {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(3%, 3%) scale(1.05); }
  }

  .logo-container {
    position: relative;
    margin-bottom: 40px;
  }

  .anneau-horizontal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 80px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 215, 0, 0.2) 20%, 
      rgba(255, 215, 0, 0.8) 45%, 
      rgba(255, 215, 0, 1) 50%, 
      rgba(255, 215, 0, 0.8) 55%, 
      rgba(255, 215, 0, 0.2) 80%, 
      transparent 100%
    );
    filter: blur(20px);
    border-radius: 50%;
    opacity: 0.9;
  }

  .logo-dore {
    font-size: 105px;
    font-weight: 400;
    position: relative;
    z-index: 2;
    margin: 0;
    font-family: 'Georgia', serif;
    background: linear-gradient(180deg, #FFFBE6 0%, #FFD700 40%, #E6B800 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 60px rgba(255, 215, 0, 1)) 
            drop-shadow(0 0 120px rgba(200, 70, 130, 0.8));
    letter-spacing: 6px;
  }

  .sous-titre {
    font-size: 26px;
    color: #F5E6FF;
    margin-top: 40px;
    z-index: 1;
    max-width: 850px;
    font-weight: 300;
    line-height: 1.9;
    text-shadow: 0 4px 30px rgba(140, 50, 90, 1);
  }

  .btn-dore {
    position: fixed;
    bottom: 75px;
    left: 50%;
    transform: translateX(-50%);
    padding: 18px 65px;
    font-size: 22px;
    font-weight: 400;
    border: 3px solid #FFD700;
    border-radius: 50px;
    cursor: pointer;
    z-index: 10;
    background: linear-gradient(180deg, #FFD700 0%, #D4A017 100%);
    color: #0A0515;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 0 70px rgba(255, 215, 0, 1), 
                0 0 140px rgba(200, 70, 130, 0.7),
                inset 0 4px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    font-family: 'Georgia', serif;
  }

  .btn-dore:hover {
    transform: translateX(-50%) translateY(-6px);
    box-shadow: 0 0 100px rgba(255, 215, 0, 1), 
                0 0 180px rgba(200, 70, 130, 0.9),
                inset 0 4px 0 rgba(255, 255, 255, 1);
  }

  @media (max-width: 768px) {
    .logo-dore { font-size: 65px; letter-spacing: 3px; }
    .anneau-horizontal { width: 400px; height: 60px; }
    .sous-titre { font-size: 21px; padding: 0 30px; }
    .btn-dore { 
      bottom: 50px; 
      padding: 16px 55px; 
      font-size: 20px; 
    }
  }
</style>
    
  

