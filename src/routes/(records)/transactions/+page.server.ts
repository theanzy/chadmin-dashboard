import { getNullableVal } from '$lib/utils';
import { getTransactions, type TransactionSearchParams } from '$lib/server/query';

export async function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;
	const sortBy = getNullableVal(url.searchParams.get('sort_by'), undefined, String);
	const orderBy = getNullableVal(url.searchParams.get('order_by'), undefined, String);
	const searchParams = {
		transactionId: getNullableVal(url.searchParams.get('id'), undefined, (d) => parseInt(d)),
		customer: getNullableVal(url.searchParams.get('customer'), undefined),
		affiliate: getNullableVal(url.searchParams.get('affiliate'), undefined),
		minPrice: getNullableVal(url.searchParams.get('minPrice'), undefined, (d) => parseInt(d)),
		maxPrice: getNullableVal(url.searchParams.get('maxPrice'), undefined, (d) => parseInt(d))
	} satisfies TransactionSearchParams;

	return {
		transactions: getTransactions(page - 1, pageSize, searchParams, sortBy, orderBy)
	};
}
