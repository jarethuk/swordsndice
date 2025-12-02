import React from 'react';
import {Image} from 'react-native';
import {Spin} from './Spin';

interface Props {
	size?: number;
	white?: boolean;
}

export const Loading = ({ size = 30, white }: Props) => {
	return (
		<Spin style={{ height: size, width: size }}>
			{white ? (
				<Image
					source={require('../../assets/icons/spinner-white.svg')}
					style={{
						height: size,
						width: size,
					}}
				/>
			) : (
				<Image
					source={require('../../assets/icons/spinner.svg')}
					style={{
						height: size,
						width: size,
					}}
				/>
			)}
		</Spin>
	);
};
