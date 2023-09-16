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
