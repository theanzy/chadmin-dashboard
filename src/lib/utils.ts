export function getMonthName(monthNumber: number) {
	const date = new Date();
	date.setMonth(monthNumber - 1);

	return date.toLocaleString('en-US', { month: 'long' });
}

export const unitFormatter = new Intl.NumberFormat();
export const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
