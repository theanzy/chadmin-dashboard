export function getPagination(pageIndex: number, maxPages: number) {
	const middleSize = 3;
	const result = [];
	let offset = Math.floor(middleSize / 2);
	if (pageIndex === 0) {
		offset = middleSize - 1;
	} else if (pageIndex === maxPages - 1) {
		offset = middleSize - 1;
	}
	for (let i = 1; i <= maxPages; i++) {
		if (
			i == 1 ||
			(pageIndex - offset < i && pageIndex + offset + 1 >= i) ||
			i == pageIndex ||
			i == maxPages
		) {
			result.push(i);
		} else if (i == pageIndex - offset || i == pageIndex + (offset + 2)) {
			result.push('...');
		}
	}
	return result;
}
