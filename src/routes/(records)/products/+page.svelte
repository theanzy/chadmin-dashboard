<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pagination from '$lib/components/Pagination.svelte';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import { getPagination } from '$lib/paginate.js';
	import { currencyFormatter, getNullableVal, unitFormatter } from '$lib/utils.js';

	export let data;

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));
	$: queryProductName = getNullableVal($page.url.searchParams.get('name'), '');

	function getUrlQueryString(pageNumber: number) {
		const query = new URLSearchParams($page.url.searchParams.toString());
		query.set('page', pageNumber.toString());
		query.set('pageSize', pageSize.toString());
		return `?${query.toString()}`;
	}
</script>

<h2 class="h3 font-bold">Products</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Items sold for the year {new Date().getUTCFullYear()}
</h5>

{#if data.products.data?.length}
	<form class="flex flex-row gap-1 mb-3 items-stretch" method="get">
		<!-- <input type="hidden" name="page" value={queryPageNumber} />
			<input type="hidden" name="pageSize" value={queryPageSize} /> -->
		<input class="input px-2" name="name" value={queryProductName} />
		<button
			type="submit"
			class="btn btn-sm variant-filled-tertiary grid place-items-center w-9 h-9"
		>
			<SearchIcon class="w-5 h-5" />
		</button>
	</form>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
		{#each data.products.data as product (product.id)}
			<div class="card flex flex-col py-2">
				<header class="card-header pt-3 pb-1">
					<h6 class="h6 text-sm lg:text-base font-semibold text-ellipsis line-clamp-2">
						{product.name}
					</h6>
					<p class="badge variant-filled-surface text-xs rounded-full w-max mt-1">
						{product.category}
					</p>
				</header>
				<section class="px-4 py-2 flex-1 text-sm text-surface-700-200-token flex flex-col gap-2">
					<p>Price: {currencyFormatter.format(product.price)}</p>
					<p>Yearly Sales: {currencyFormatter.format(product.yearlyRevenue)}</p>
					<p>Yearly Units Sold: {unitFormatter.format(product.yearlyUnitsSold)}</p>
				</section>
			</div>
		{/each}
	</div>
	<Pagination
		bind:currentPageNumber
		maxPage={Math.ceil(data.products.count / pageSize) || 1}
		on:change={(e) => {
			goto(getUrlQueryString(e.detail));
		}}
	/>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">No products found</p>
	</div>
{/if}
