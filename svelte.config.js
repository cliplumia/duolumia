import adapter from '@sveltejs/adapter-netlify';
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};
export default config;
