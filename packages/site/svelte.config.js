import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { join } from 'node:path';

const proj_root = join(import.meta.url.replace('file://', ''), '../../..');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: { runes: true },
	kit: {
		adapter: adapter({
			fallback: '404.html',
			pages: join(proj_root, 'docs'),
			assets: join(proj_root, 'docs'),
		}),
		paths: { base: '/pulse' },
	},
};

export default config;
