module.exports = (api) => {
	api.cache(true);
	const plugins = [];

	plugins.push(['inline-import', { extensions: ['.sql'] }]);
	plugins.push('react-native-worklets/plugin');

	return {
		presets: ['babel-preset-expo'],
		plugins,
	};
};
