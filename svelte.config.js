import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  kit: {
  prerender: {
    handleHttpError: 'warn'  // ou 'ignore'
  }
}
