export const ensureLength = (value?: string, length = 20): string => {
	if (!value) {
		return '';
	}

	if (value.length < length) {
		return value;
	}

	return `${value.substring(0, length)}...`;
};
