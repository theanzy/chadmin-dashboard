import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const mytheme: CustomThemeConfig = {
	name: 'mytheme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base':
			"Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		'--theme-font-family-heading': 'Poppins, system-ui',
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '4px',
		'--theme-rounded-container': '4px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '0 0 0',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #0c59a1
		'--color-primary-50': '219 230 241', // #dbe6f1
		'--color-primary-100': '206 222 236', // #cedeec
		'--color-primary-200': '194 214 232', // #c2d6e8
		'--color-primary-300': '158 189 217', // #9ebdd9
		'--color-primary-400': '85 139 189', // #558bbd
		'--color-primary-500': '12 89 161', // #0c59a1
		'--color-primary-600': '11 80 145', // #0b5091
		'--color-primary-700': '9 67 121', // #094379
		'--color-primary-800': '7 53 97', // #073561
		'--color-primary-900': '6 44 79', // #062c4f
		// secondary | #a892aa
		'--color-secondary-50': '242 239 242', // #f2eff2
		'--color-secondary-100': '238 233 238', // #eee9ee
		'--color-secondary-200': '233 228 234', // #e9e4ea
		'--color-secondary-300': '220 211 221', // #dcd3dd
		'--color-secondary-400': '194 179 196', // #c2b3c4
		'--color-secondary-500': '168 146 170', // #a892aa
		'--color-secondary-600': '151 131 153', // #978399
		'--color-secondary-700': '126 110 128', // #7e6e80
		'--color-secondary-800': '101 88 102', // #655866
		'--color-secondary-900': '82 72 83', // #524853
		// tertiary | #ee56f0
		'--color-tertiary-50': '252 230 253', // #fce6fd
		'--color-tertiary-100': '252 221 252', // #fcddfc
		'--color-tertiary-200': '251 213 251', // #fbd5fb
		'--color-tertiary-300': '248 187 249', // #f8bbf9
		'--color-tertiary-400': '243 137 245', // #f389f5
		'--color-tertiary-500': '238 86 240', // #ee56f0
		'--color-tertiary-600': '214 77 216', // #d64dd8
		'--color-tertiary-700': '179 65 180', // #b341b4
		'--color-tertiary-800': '143 52 144', // #8f3490
		'--color-tertiary-900': '117 42 118', // #752a76
		// success | #30cc05
		'--color-success-50': '224 247 218', // #e0f7da
		'--color-success-100': '214 245 205', // #d6f5cd
		'--color-success-200': '203 242 193', // #cbf2c1
		'--color-success-300': '172 235 155', // #aceb9b
		'--color-success-400': '110 219 80', // #6edb50
		'--color-success-500': '48 204 5', // #30cc05
		'--color-success-600': '43 184 5', // #2bb805
		'--color-success-700': '36 153 4', // #249904
		'--color-success-800': '29 122 3', // #1d7a03
		'--color-success-900': '24 100 2', // #186402
		// warning | #ffc824
		'--color-warning-50': '255 247 222', // #fff7de
		'--color-warning-100': '255 244 211', // #fff4d3
		'--color-warning-200': '255 241 200', // #fff1c8
		'--color-warning-300': '255 233 167', // #ffe9a7
		'--color-warning-400': '255 217 102', // #ffd966
		'--color-warning-500': '255 200 36', // #ffc824
		'--color-warning-600': '230 180 32', // #e6b420
		'--color-warning-700': '191 150 27', // #bf961b
		'--color-warning-800': '153 120 22', // #997816
		'--color-warning-900': '125 98 18', // #7d6212
		// error | #7e0101
		'--color-error-50': '236 217 217', // #ecd9d9
		'--color-error-100': '229 204 204', // #e5cccc
		'--color-error-200': '223 192 192', // #dfc0c0
		'--color-error-300': '203 153 153', // #cb9999
		'--color-error-400': '165 77 77', // #a54d4d
		'--color-error-500': '126 1 1', // #7e0101
		'--color-error-600': '113 1 1', // #710101
		'--color-error-700': '95 1 1', // #5f0101
		'--color-error-800': '76 1 1', // #4c0101
		'--color-error-900': '62 0 0', // #3e0000
		// surface | #3a3636
		'--color-surface-50': '225 225 225', // #e1e1e1
		'--color-surface-100': '216 215 215', // #d8d7d7
		'--color-surface-200': '206 205 205', // #cecdcd
		'--color-surface-300': '176 175 175', // #b0afaf
		'--color-surface-400': '117 114 114', // #757272
		'--color-surface-500': '58 54 54', // #3a3636
		'--color-surface-600': '52 49 49', // #343131
		'--color-surface-700': '44 41 41', // #2c2929
		'--color-surface-800': '35 32 32', // #232020
		'--color-surface-900': '28 26 26' // #1c1a1a
	}
};
