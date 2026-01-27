import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ensureLength } from '../../helpers/DisplayHelpers';
import { Content } from './Content';

interface Props {
	text: string;
}

export const ShowMoreText = ({ text }: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<View className={'flex flex-col gap-2'}>
			<Content type={'body'}>{open ? text : ensureLength(text, 110)}</Content>
			{text.length > 100 && (
				<Pressable onPress={() => setOpen(!open)}>
					<Content type={'note'} variant={'accent'}>
						{open ? 'Hide' : 'Show more'}
					</Content>
				</Pressable>
			)}
		</View>
	);
};
