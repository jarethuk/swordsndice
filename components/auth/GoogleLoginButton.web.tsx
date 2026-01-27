import { faGoogle } from '@awesome.me/kit-6b5fd61d92/icons/classic/brands';
import { View } from 'react-native';
import { Button } from '../common/Button';
import { Content } from '../common/Content';
import { FAIcon } from '../common/FAIcon';

const CLIENT_ID =
	'680803508827-r331rb9vmsi3vreshpuquftsvkib9a5c.apps.googleusercontent.com';

export default function GoogleLoginButton() {
	const signIn = async () => {
		window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google&response_type=code&scope=openid%20email&prompt=consent`;
	};

	return (
		<Button
			variant={'outline'}
			themeOverride={'dark'}
			onPress={signIn}
			content={
				<View className={'flex flex-row items-center gap-4'}>
					<FAIcon icon={faGoogle} colour={'white'} size={24} />

					<Content type={'cta'} size={'lg'} themeOverride={'dark'}>
						Login with Google
					</Content>
				</View>
			}
		/>
	);
}
