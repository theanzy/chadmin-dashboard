import { getCumulativeSales } from '$lib/server/queries';

export async function load() {
	return {
		cumulativeSales: getCumulativeSales(new Date().getUTCFullYear())
	};
}
