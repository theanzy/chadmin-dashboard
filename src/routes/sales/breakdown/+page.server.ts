import { getSalesByCategory } from '$lib/server/query';

export async function load() {
	return {
		sales: getSalesByCategory(new Date().getUTCFullYear())
	};
}
