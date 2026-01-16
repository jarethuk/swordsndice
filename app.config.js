const IS_DEV = process.env.APP_VARIANT === 'dev';

export default {
	expo: {
		name: IS_DEV ? 'Swords & Dice (Dev)' : 'Swords & Dice',
		slug: IS_DEV ? 'swordsndice-dev' : 'swordsndice',
		version: '0.0.1',
		orientation: 'portrait',
		icon: './assets/icon.png',
		scheme: IS_DEV ? 'swordsndice-dev' : 'swordsndice',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		ios: {
			supportsTablet: false,
			config: {
				usesNonExemptEncryption: false,
			},
			bundleIdentifier: IS_DEV ? 'com.swordsndice.dev' : 'com.swordsndice',
			associatedDomains: IS_DEV ? [] : ['applinks:api.swordsndice.com'],
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-icon.png',
				backgroundColor: '#15082F',
			},
			permissions: ['android.permission.CAMERA'],
			package: 'com.swordsndice',
		},
		splash: {
			image: './assets/splash-icon.png',
			imageWidth: 200,
			resizeMode: 'contain',
			backgroundColor: '#15082F',
		},
		web: {
			bundler: 'metro',
			output: 'server',
			favicon: './assets/favicon.png',
		},
		plugins: [
			'expo-router',
			[
				'expo-splash-screen',
				{
					image: './assets/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#3C0366',
				},
			],
			[
				'expo-camera',
				{
					cameraPermission: 'Allow access your camera to scan QR codes',
				},
			],
			[
				'expo-image-picker',
				{
					photosPermission:
						'The app accesses your photos to let you set a picture on a contact',
					cameraPermission:
						'The app allows you to take a picture for a contact',
				},
			],
			'expo-font',
		],
		experiments: {
			typedRoutes: true,
			reactCompiler: true,
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: IS_DEV
					? '0d9b8a20-1e9d-4098-9b23-113926cf1f35'
					: '4abf2eb5-a93d-4d66-aaea-147260ae61d0',
			},
		},
	},
};
