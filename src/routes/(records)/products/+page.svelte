<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import { getPagination } from '$lib/paginate.js';
	import { currencyFormatter, getNullableVal, unitFormatter } from '$lib/utils.js';

	export let data;

	$: queryPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: queryPageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));
	$: queryProductName = getNullableVal($page.url.searchParams.get('name'), '');

	function getUrlQueryString(pageNumber: number) {
		const query = new URLSearchParams($page.url.searchParams.toString());
		query.set('page', pageNumber.toString());
		query.set('pageSize', queryPageSize.toString());
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
	<div
		class="flex flex-row w-max rounded border border-surface-300 dark:border-surface-600 mt-2 [&>*]:border-l [&>*]:border-surface-300 dark:[&>*]:border-surface-600 ml-auto"
	>
		<button
			aria-label="previous page"
			class="w-9 h-9 grid place-items-center disabled:text-surface-300 dark:disabled:text-surface-400 hover:text-primary-400 first:border-l-0"
			disabled={queryPageNumber - 1 === 0}
			on:click={() => goto(getUrlQueryString(queryPageNumber - 1))}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="15"
				height="15"
				viewBox="0 0 15 15"
				class="w-3 h-3"><path fill="currentColor" d="M3 7.5L11 0v15L3 7.5Z" /></svg
			>
		</button>
		{#each getPagination(queryPageNumber - 1, Math.ceil(data.products.count / 10) - 1) as pageNumber}
			{#if typeof pageNumber === 'number'}
				<button
					class="text-sm w-9 h-9 {pageNumber === queryPageNumber
						? 'text-primary-500'
						: 'hover:text-primary-400'}"
					on:click={() => goto(getUrlQueryString(+pageNumber))}>{pageNumber}</button
				>
			{:else}
				<span class="text-sm w-9 h-9 grid place-items-center text-surface-300 dark:text-surface-400"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						class="w-4 h-4"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
						/></svg
					>
				</span>
			{/if}
		{/each}
		<button
			aria-label="previous page"
			class="w-9 h-9 grid place-items-center disabled:text-surface-300 dark:disabled:text-surface-400 hover:text-primary-400"
			disabled={queryPageNumber === Math.ceil(data.products.count / 10) - 1}
			on:click={() => goto(getUrlQueryString(queryPageNumber + 1))}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="15"
				height="15"
				viewBox="0 0 15 15"
				class="w-3 h-3"><path fill="currentColor" d="M12 7.5L4 0v15l8-7.5Z" /></svg
			>
		</button>
	</div>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">No products found</p>
	</div>
{/if}
