/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
	safelist: [
		'border-border-light',
		'border-border-dark',
		'bg-primary-light',
		'bg-primary-dark',
		'text-text-light',
		'text-text-dark',
	],
};
