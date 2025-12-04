import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Content} from './Content';
import {Loading} from './Loading';

const messages = [
	'Polishing coins...',
	'Digging the trenches...',
	'Please HODL, your call is important to us...',
	'Decrypting sense of humour...',
	'Ignoring all the red...',
	'When lambo?',
];

export const LoadingScreen = () => {
	const [index, setIndex] = useState(
		Math.floor(Math.random() * messages.length),
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (index === messages.length - 1) {
				setIndex(0);
			} else {
				setIndex(index + 1);
			}
		}, 5_000);
		return () => clearTimeout(timeout);
	}, [index]);

	return (
		<View
			className={'flex flex-col grow justify-center items-center h-full gap-3'}
		>
			<Loading />

			<Content type={'subtitle'} size={'lg'}>
				{messages[index]}
			</Content>
		</View>
	);
};
