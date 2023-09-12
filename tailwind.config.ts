import { join } from 'path';
import type { Config } from 'tailwindcss';
import { mytheme } from './src/lib/theme';

import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: {
				custom: [mytheme]
			}
		})
	]
} satisfies Config;

export default config;
