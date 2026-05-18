<script>
import { page } from '$app/stores';
import { onMount } from 'svelte';

let menuOpen = false;

function toggleMenu() {
menuOpen = !menuOpen;
}
</script>

<header>
<nav>
<div class="logo">
<a href="/">ClipLumia</a>
</div>

<button class="burger" on:click={toggleMenu} aria-label="Menu">
<span></span>
<span></span>
<span></span>
</button>

<ul class:open={menuOpen}>
<li class:active={$page.url.pathname === '/'}>
<a href="/" on:click={() => menuOpen = false}>Accueil</a>
</li>
<li class:active={$page.url.pathname === '/generer'}>
<a href="/generer" on:click={() => menuOpen = false}>Générer</a>
</li>
<li class:active={$page.url.pathname === '/tarifs'}>
<a href="/tarifs" on:click={() => menuOpen = false}>Tarifs</a>
</li>
</ul>
</nav>
</header>

<style>
header {
padding: 1rem 2rem;
background: #0a0a0a;
border-bottom: 1px solid #222;
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
}
.burger span {
width: 25px;
height: 2px;
background: #fff;
}

@media (max-width: 768px) {
.burger { display: flex; }
ul {
display: none;
position: absolute;
top: 70px;
left: 0;
right: 0;
background: #0a0a0a;
flex-direction: column;
padding: 1rem 2rem;
gap: 1rem;
border-bottom: 1px solid #222;
}
ul.open { display: flex; }
}
</style> 
