import * as Crypto from 'expo-crypto';
import stringify from 'json-stable-stringify';

export const hashObject = async (obj: unknown) => {
	const stableString = stringify(obj) ?? '';

	return await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		stableString,
	);
};
