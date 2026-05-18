<svelte:head>
<title>ClipLumia - Créez des vidéos et images IA sans crédits</title>
<meta name="description" content="Générez des vidéos et images IA d'exception avec ClipLumia  Sans credit." /> 
</svelte:head>

<section class="hero">
<video
src="/hero.mp4"
autoplay
muted
loop
playsinline
class="hero-video"
>
</video>

<div class="overlay"></div>

<div class="container">
<h1>ClipLumia</h1>
<p class="subtitle">
Créez des vidéos et images IA d'exception sans crédits
</p>
<a href="/generer" class="cta">Commencer à créer</a>
</div>
</section>

<section class="features">
<div class="container">
<div class="grid">
<div class="card">
<h3>🚀 Illimité</h3>
<p>Générez autant que vous voulez. Pas de crédits qui bloquent votre créativité.</p>
</div>
<div class="card">
<h3>🎨 Qualité Pro</h3>
<p>Modèles IA de dernière génération pour des rendus photo-réalistes.</p>
</div>
<div class="card">
<h3>⚡ Rapide</h3>
<p>Vos créations en quelques secondes. Pas d'attente interminable.</p>
</div>
</div>
</div>
</section>

<style>
.hero {
position: relative;
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
text-align: center;
padding: 2rem;
overflow: hidden;
}
.hero-video {
position: absolute;
top: 50%;
left: 50%;
min-width: 100%;
min-height: 100%;
width: auto;
height: auto;
transform: translate(-50%, -50%);
object-fit: cover;
z-index: 1;
}
.overlay {
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
z-index: 2;
}
.container {
position: relative;
z-index: 3;
max-width: 1200px;
margin: 0 auto;
}
h1 {
font-size: clamp(3rem, 8vw, 6rem);
font-weight: 800;
color: #fff;
margin-bottom: 1.5rem;
line-height: 1.1;
text-shadow: 0 2px 20px rgba(0,0,0,0.5);
}
.subtitle {
font-size: clamp(1.1rem, 2.5vw, 1.5rem);
color: #eee;
margin-bottom: 2.5rem;
max-width: 600px;
margin-left: auto;
margin-right: auto;
text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}
.cta {
display: inline-block;
padding: 1rem 2.5rem;
background: linear-gradient(90deg, #ff6b6b, #feca57);
color: #000;
font-weight: 700;
text-decoration: none;
border-radius: 50px;
transition: transform 0.2s, box-shadow 0.2s;
}
.cta:hover {
transform: translateY(-2px);
box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}
.features {
padding: 4rem 2rem;
background: #0a0a0a;
}
.grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 2rem;
}
.card {
background: #111;
padding: 2rem;
border-radius: 12px;
border: 1px solid #222;
}
.card h3 {
font-size: 1.5rem;
margin-bottom: 1rem;
color: #fff;
}
.card p {
color: #888;
line-height: 1.6;
}

@media (max-width: 768px) {
.hero { min-height: 80vh; padding: 3rem 1rem; }
.features { padding: 3rem 1rem; }
}
</style> 

