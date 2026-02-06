import type { ReactElement } from 'react';

jest.mock('react-native-reanimated', () => {
	const Reanimated = jest.requireActual('react-native-reanimated/mock');
	Reanimated.default.call = () => {};

	return {
		...Reanimated,
		FadeIn: {},
		SlideInDown: {},
	};
});

jest.mock('@gorhom/bottom-sheet', () => {
	const { View } = jest.requireActual('react-native');
	return {
		BottomSheetModal: ({ children }: { children: ReactElement }) => (
			<View>{children}</View>
		),
		BottomSheetBackdrop: ({ children }: { children?: ReactElement }) => (
			<View>{children}</View>
		),
		BottomSheetScrollView: ({ children }: { children: ReactElement }) => (
			<View>{children}</View>
		),
		BottomSheetTextInput: (props: any) => {
			const { TextInput } = jest.requireActual('react-native');
			return <TextInput {...props} />;
		},
	};
});

jest.mock('@fortawesome/react-native-fontawesome', () => {
	const { Text } = jest.requireActual('react-native');
	return {
		FontAwesomeIcon: (props: any) => <Text testID={'fa-icon'} {...props} />,
	};
});

jest.mock('expo-image', () => {
	const { Image } = jest.requireActual('react-native');
	return { Image };
});

jest.mock('expo-router', () => ({
	router: {
		navigate: jest.fn(),
		back: jest.fn(),
		dismiss: jest.fn(),
	},
}));

jest.mock('react-native-safe-area-context', () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-outside-press', () => {
	return ({ children }: { children: ReactElement }) => <>{children}</>;
});

jest.mock('../../hooks/useColours', () => ({
	useColours: () => ({
		background: '#000000',
		primary: '#111111',
		secondary: '#222222',
		positive: '#333333',
		negative: '#444444',
		warning: '#555555',
		info: '#666666',
		text: '#777777',
		muted: '#888888',
	}),
}));

jest.mock('../../states/useThemeStore', () => ({
	useTheme: () => 'light',
}));

jest.mock('../../api/games/useAPIGameInvites', () => ({
	useAPIGameInvites: jest.fn(() => ({ data: [{ id: '1' }] })),
}));

jest.mock('../../api/groups/useAPIGroupInvites', () => ({
	useAPIGroupInvites: jest.fn(() => ({ data: [{ id: '2' }, { id: '3' }] })),
}));

jest.mock('../../states/useUserStore', () => ({
	useUser: () => ({ username: 'tester', image: null }),
}));

jest.mock('../../../assets/icons/spinner.svg', () => 'spinner', {
	virtual: true,
});
jest.mock('../../../assets/icons/spinner-white.svg', () => 'spinner-white', {
	virtual: true,
});
