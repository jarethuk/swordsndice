import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useAPILogout } from '../../api/auth/useAPILogout';
import { Button } from '../../components/common/Button';
import { Content } from '../../components/common/Content';
import { Page } from '../../components/common/Page';
import Toggle from '../../components/common/Toggle';
import { StorageHelper } from '../../helpers/StorageHelper';
import { useTheme, useThemeActions } from '../../states/useThemeStore';

export default function Settings() {
	const theme = useTheme();
	const { setTheme } = useThemeActions();
	const { refetch: apiLogout, isLoading: isLoggingOut } = useAPILogout();
	const client = useQueryClient();

	const [isClearingCache, setIsClearingCache] = useState(false);

	const logout = useCallback(async () => {
		await apiLogout();
		await client.invalidateQueries();
		window.location.href = '/';
	}, [client, apiLogout]);

	const clearCache = useCallback(async () => {
		setIsClearingCache(true);
		await client.invalidateQueries();
		setIsClearingCache(false);
	}, [client]);

	const toggleTheme = useCallback(async () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';

		setTheme(newTheme);
		await StorageHelper.set('theme', newTheme);
	}, [setTheme, theme]);

	return (
		<Page title={'Settings'}>
			<View className={'flex flex-row items-center'}>
				<Content size={'md'} type={'subtitle'}>
					Light mode
				</Content>

				<Toggle
					className={'ml-auto'}
					value={theme === 'light'}
					onChange={toggleTheme}
				/>
			</View>

			<Button
				content={'Clear Cache'}
				onPress={clearCache}
				loading={isClearingCache}
			/>

			<Button content={'Logout'} onPress={logout} loading={isLoggingOut} />
		</Page>
	);
}
