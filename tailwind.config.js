/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.tsx', './components/**/*.tsx'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: require('./Colours.js'),
		},
	},
	plugins: [],
	safelist: [
		'border-border-light',
		'border-border-dark',
		'bg-primary-light',
		'bg-primary-dark',
		'text-text-light',
		'text-text-dark',
	],
};
