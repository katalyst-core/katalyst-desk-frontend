import { preprocessMeltUI } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-static';
import { sequence } from '@sveltejs/kit/hooks';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			trailingSlash: 'always',
			precompress: false,
			fallback: '404.html',
			prerender: {
				default: true
			}
			// routes: {
			// 	include: ['/*'],
			// 	exclude: ['<all>']
			// },
			// platformProxy: {
			// 	configPath: 'wrangler.toml',
			// 	environment: undefined,
			// 	experimentalJsonConfig: false,
			// 	persist: false
			// }
		}),

		alias: {
			'@/*': './path/to/lib/*',
			'$stores/*': 'src/stores/*',
			'$utils/*': 'src/utils/*',
			'$types/*': 'src/types/*',
			'$ui/*': 'src/lib/components/ui/*',
			'$module/*': 'src/lib/components/module/*',
			'$api/*': 'src/api/*',
			'$schema/*': 'src/schema/*'
		}
	}
};

export default config;
