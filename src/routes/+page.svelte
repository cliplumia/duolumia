 import { onMount } from 'svelte';
 
  let canvas;
 
  onMount(() => {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
   
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.6 + 0.3
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
    <div class="anneau"></div>
    <h1 class="logo-dore">ClipLumia</h1>
  </div>
 
  <p class="sous-titre">"Créez des vidéos et images IA d'exception sans crédits"</p>
</section>

<a href="/generer" class="btn-dore">Visiter le site</a>

<style>
  :global(body) {
    background: #0D0B1F;
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
    background: radial-gradient(ellipse at center, rgba(25, 10, 50, 0.5) 0%, #0D0B1F 70%);
  }

  .logo-container {
    position: relative;
    margin-bottom: 35px;
  }

  .anneau {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 130px;
    border-radius: 50%;
    background: radial-gradient(ellipse, transparent 35%, rgba(255, 215, 0, 0.4) 65%, transparent 100%);
    filter: blur(20px);
    animation: rotation 10s linear infinite;
  }

  @keyframes rotation {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .logo-dore {
    font-size: 90px;
    font-weight: 400;
    position: relative;
    z-index: 2;
    margin: 0;
    font-family: 'Georgia', serif;
    background: linear-gradient(180deg, #FFFACD 0%, #FFD700 40%, #DAA520 80%, #B8860B 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 35px rgba(255, 215, 0, 0.9))
            drop-shadow(0 0 70px rgba(255, 215, 0, 0.5));
    letter-spacing: 3px;
  }

  .sous-titre {
    font-size: 24px;
    color: #F0E6D2;
    margin-top: 25px;
    z-index: 1;
    max-width: 700px;
    font-weight: 300;
    line-height: 1.7;
    text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8);
  }

  .btn-dore {
    position: fixed;
    bottom: 70px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 50px;
    font-size: 19px;
    font-weight: 400;
    border: 2.5px solid #DAA520;
    border-radius: 50px;
    cursor: pointer;
    z-index: 10;
    background: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
    color: #1A1410;
    text-decoration: none;
    display: inline-block;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8),
                inset 0 2px 0 rgba(255, 255, 255, 0.5),
                inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    font-family: 'Georgia', serif;
  }

  .btn-dore:hover {
    transform: translateX(-50%) translateY(-3px);
    box-shadow: 0 0 60px rgba(255, 215, 0, 1),
                inset 0 2px 0 rgba(255, 255, 255, 0.7),
                inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .logo-dore { font-size: 55px; }
    .anneau { width: 320px; height: 90px; }
    .sous-titre { font-size: 18px; padding: 0 25px; }
    .btn-dore {
      bottom: 40px;
      padding: 13px 40px;
      font-size: 17px;
    }
  }
</style> 
