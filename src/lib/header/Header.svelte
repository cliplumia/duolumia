<script>
import { page } from '$app/stores';

let menuOpen = false;

function toggleMenu() {
menuOpen = !menuOpen;
}

function closeMenu() {
menuOpen = false;
}
</script>

<header>
<nav>
<div class="logo">
<a href="/" on:click={closeMenu}>ClipLumia</a>
</div>

<button class="burger" on:click={toggleMenu} aria-label="Menu">
<span></span>
<span></span>
<span></span>
</button>

<ul class:open={menuOpen}>
<li class:active={$page.url.pathname === '/'}>
<a href="/" on:click={closeMenu}>Accueil</a>
</li>
<li class:active={$page.url.pathname === '/generer'}>
<a href="/generer" on:click={closeMenu}>Générer</a>
</li>
<li class:active={$page.url.pathname === '/tarifs'}>
<a href="/tarifs" on:click={closeMenu}>Tarifs</a>
</li>
</ul>
</nav>
</header>

<style>
header {
position: fixed;
top: 0;
left: 0;
right: 0;
padding: 1rem 2rem;
background: rgba(10, 10, 10, 0.8);
backdrop-filter: blur(10px);
border-bottom: 1px solid #222;
z-index: 100;
}
nav {
display: flex;
justify-content: space-between;
align-items: center;
max-width: 1200px;
margin: 0 auto;
}
.logo a {
font-size: 1.5rem;
font-weight: 800;
color: #fff;
text-decoration: none;
}
ul {
display: flex;
gap: 2rem;
list-style: none;
margin: 0;
padding: 0;
}
a {
color: #ccc;
text-decoration: none;
font-weight: 500;
transition: color 0.2s;
}
a:hover, .active a {
color: #fff;
}
.burger {
display: none;
flex-direction: column;
gap: 4px;
background: none;
border: none;
cursor: pointer;
padding: 0.5rem;
}
.burger span {
width: 25px;
height: 2px;
background: #fff;
transition: 0.3s;
}

@media (max-width: 768px) {
.burger { display: flex; }
ul {
display: none;
position: fixed;
top: 65px;
left: 0;
right: 0;
background: rgba(10, 10, 10, 0.98);
backdrop-filter: blur(10px);
flex-direction: column;
padding: 2rem;
gap: 1.5rem;
border-bottom: 1px solid #222;
}
ul.open { display: flex; }
}
</style> 
