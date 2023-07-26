import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import terser from '@rollup/plugin-terser';
import sass from 'rollup-plugin-scss';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import {writeFileSync} from 'fs';
import {version} from './package.json';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: 'packages/core/src/index.js',
		output: {
			format: 'es',
			file: 'packages/core/index.js'
		},
		external: ['svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					// enable run-time checks when not in production
					dev: !production,
					discloseVersion: false,
					css: false
				},
			}),
			// we'll extract any component CSS out into
			// a separate file - better for performance
			sass({
				output: (styles, styleNodes) => {
					writeFileSync('packages/core/index.css', styles);
				}
			}),
		],
	},
	{
		input: 'packages/interaction/src/index.js',
		output: {
			format: 'es',
			file: 'packages/interaction/index.js'
		},
		external: ['@event-calendar/core', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
					discloseVersion: false,
					css: false
				}
			})
		],
	},
	{
		input: 'packages/day-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/day-grid/index.js'
		},
		external: ['@event-calendar/core', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
					discloseVersion: false,
					css: false
				}
			})
		],
	},
	{
		input: 'packages/list/src/index.js',
		output: {
			format: 'es',
			file: 'packages/list/index.js'
		},
		external: ['@event-calendar/core', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
					discloseVersion: false,
					css: false
				}
			})
		],
	},
	{
		input: 'packages/time-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/time-grid/index.js'
		},
		external: ['@event-calendar/core', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
					discloseVersion: false,
					css: false
				}
			})
		],
	},
	{
		input: 'packages/resource-time-grid/src/index.js',
		output: {
			format: 'es',
			file: 'packages/resource-time-grid/index.js'
		},
		external: ['@event-calendar/core', '@event-calendar/time-grid', 'svelte', 'svelte/internal', 'svelte/store'],
		plugins: [
			svelte({
				compilerOptions: {
					dev: !production,
					discloseVersion: false,
					css: false
				}
			})
		],
	},
	{
		input: 'packages/build/src/index.js',
		output: {
			format: 'iife',
			name: 'EventCalendar',
			file: 'packages/build/event-calendar.min.js',
			sourcemap: true,
			banner: '/*!\nEventCalendar v' + version + '\nhttps://github.com/vkurko/calendar\n*/'
		},
		plugins: [
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				// babelHelpers: 'bundled',
				exclude: ['node_modules/@babel/**', 'node_modules/core-js-pure/**'],
				presets: [
					['@babel/preset-env', {
						// modules: false,
						// spec: true,
						// forceAllTransforms: true,
						// useBuiltIns: 'usage',
						shippedProposals: true,
						// corejs: '3.6.5'
					}]
				],
				plugins: [
					['@babel/plugin-transform-runtime', {
						useESModules: true,
						corejs: 3
					}]
				]
			}),

			sass({
				output: (styles, styleNodes) => {
					writeFileSync('packages/build/event-calendar.min.css', styles);
				},
				outputStyle: 'compressed',
				processor: css => postcss([autoprefixer])
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload('public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}
];

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
