 import { onMount } from 'svelte';
  let canvas;
  
  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 350; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3,
        speedX: Math.random() * 0.15 - 0.075,
        speedY: Math.random() * 0.15 - 0.075,
        opacity: Math.random() * 1 + 0.2,
        twinkle: Math.random() * 0.03
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.opacity += p.twinkle;
        if (p.opacity > 1 || p.opacity < 0.2) p.twinkle *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
        
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

<div class="page">
  <div class="logo-wrap">
    <div class="anneau-ellipse"></div>
    <h1 class="logo-or">ClipLumia</h1>
  </div>
  <p class="slogan">"Créez des vidéos et images IA d'exception sans crédits"</p>
  <a href="/generer" class="btn-or">Visiter le site</a>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #0A0515;
  }

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .page {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: 
      radial-gradient(ellipse 200% 60% at 50% 0%, rgba(200, 70, 110, 0.3) 0%, transparent 60%),
      radial-gradient(ellipse 100% 100% at 50% 50%, rgba(100, 25, 130, 0.25) 0%, transparent 70%),
      linear-gradient(180deg, #1F0A2E 0%, #140A1F 50%, #0A0515 100%);
  }

  .logo-wrap {
    position: relative;
    margin-bottom: 50px;
  }

  .anneau-ellipse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-10deg);
    width: 850px;
    height: 110px;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 215, 0, 0.4) 30deg,
      rgba(255, 223, 100, 1) 70deg,
      rgba(255, 240, 160, 1) 90deg,
      rgba(255, 223, 100, 1) 110deg,
      rgba(255, 215, 0, 0.4) 150deg,
      transparent 180deg,
      transparent 360deg
    );
    filter: blur(25px);
    border-radius: 50%;
    animation: rotation-anneau 6s linear infinite;
  }

  @keyframes rotation-anneau {
    from { transform: translate(-50%, -50%) rotate(-10deg); }
    to { transform: translate(-50%, -50%) rotate(350deg); }
  }

  .logo-or {
    position: relative;
    z-index: 3;
    font-size: 120px;
    font-family: 'Georgia', serif;
    font-weight: 400;
    margin: 0;
    letter-spacing: 10px;
    background: linear-gradient(
      105deg,
      #5C4A00 0%,
      #8B6914 10%,
      #C9A227 20%,
      #FFD700 30%,
      #FFE55C 45%,
      #FFFACD 50%,
      #FFE55C 55%,
      #FFD700 70%,
      #C9A227 80%,
      #8B6914 90%,
      #5C4A00 100%
    );
    background-size: 250% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: or-brillant 2.5s linear infinite;
    filter: drop-shadow(0 0 100px rgba(255, 215, 0, 1)) 
            drop-shadow(0 0 200px rgba(255, 200, 100, 0.9))
            drop-shadow(0 5px 40px rgba(0, 0, 0, 0.8));
  }

  @keyframes or-brillant {
    0% { background-position: 0% center; }
    100% { background-position: 250% center; }
  }

  .slogan {
    font-size: 30px;
    color: #FFFAF0;
    font-family: 'Georgia', serif;
    font-weight: 300;
    margin: 50px 0 0 0;
    max-width: 950px;
    line-height: 2;
    text-shadow: 0 5px 40px rgba(0, 0, 0, 1);
    text-align: center;
  }

  .btn-or {
    position: fixed;
    bottom: 85px;
    right: 85px;
    padding: 20px 70px;
    font-size: 24px;
    font-family: 'Georgia', serif;
    font-weight: 400;
    border: 4px solid #FFD700;
    border-radius: 60px;
    background: linear-gradient(180deg, #FFE55C 0%, #FFD700 50%, #C9A227 100%);
    color: #1A0F00;
    text-decoration: none;
    z-index: 10;
    box-shadow: 0 0 80px rgba(255, 215, 0, 1), 
                0 0 160px rgba(255, 200, 100, 0.8),
                inset 0 4px 0 rgba(255, 255, 255, 1),
                inset 0 -4px 0 rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    animation: glow-bouton 2s ease-in-out infinite;
  }

  @keyframes glow-bouton {
    0%, 100% { box-shadow: 0 0 80px rgba(255, 215, 0, 1), 0 0 160px rgba(255, 200, 100, 0.8), inset 0 4px 0 rgba(255, 255, 255, 1), inset 0 -4px 0 rgba(0, 0, 0, 0.4); }
    50% { box-shadow: 0 0 120px rgba(255, 215, 0, 1), 0 0 220px rgba(255, 200, 100, 1), inset 0 4px 0 rgba(255, 255, 255, 1), inset 0 -4px 0 rgba(0, 0, 0, 0.5); }
  }

  .btn-or:hover {
    transform: translateY(-8px) scale(1.08);
  }

  @media (max-width: 768px) {
    .logo-or { font-size: 75px; letter-spacing: 5px; }
    .anneau-ellipse { width: 500px; height: 80px; }
    .slogan { font-size: 24px; padding: 0 35px; }
    .btn-or { bottom: 55px; right: 35px; padding: 18px 60px; font-size: 22px; }
  }
</style>

