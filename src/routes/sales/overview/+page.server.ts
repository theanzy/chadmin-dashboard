import { getCumulativeSales } from '$lib/server/query';

export async function load() {
	return {
		cumulativeSales: getCumulativeSales(new Date().getUTCFullYear())
	};
}
