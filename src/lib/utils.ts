/**
 * Make a link external.
 *
 * Usage:
 * ```
 * <a href="https://example.com/" {...external}>Example</a>
 * ```
 */
export const externalLink: Partial<HTMLAnchorElement> = {
	target: "_blank",
	rel: "noreferrer noopener"
};

export const groupBy = <T>(items: T[], key: (item: T) => string) => {
	const result: { [key: string]: T[] } = {};
	items.forEach(item => {
		const keyName = key(item);
		if (!result[keyName]) {
			result[keyName] = [];
		}
		result[keyName].push(item);
	});

	return result;
};
