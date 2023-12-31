import * as d3 from 'd3';

export function getMonthName(monthNumber: number) {
	const date = new Date();
	date.setMonth(monthNumber - 1);

	return date.toLocaleString('en-US', { month: 'long' });
}

const utcParse = d3.utcParse('%B');

export function monthToDate(month: string) {
	return utcParse(month) ?? new Date();
}

export const unitFormatter = new Intl.NumberFormat();
export const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});

export function formatDate(date: Date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

export function getStartOfMonth(date: Date) {
	const result = new Date(date);
	result.setUTCDate(1);
	return result;
}

export function getNullableVal<T>(val: string | null, defaultVal: T, updater?: (v: string) => T) {
	if (val !== null) {
		if (updater) {
			return updater(val);
		}
		return val as T;
	}
	return defaultVal;
}
