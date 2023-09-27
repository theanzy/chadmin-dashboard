<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { currencyFormatter, getNullableVal } from '$lib/utils.js';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import LoadingDots from '$lib/components/icons/LoadingDots.svelte';
	import Table from '$lib/components/Table.svelte';

	export let data;

	let totalCount = 0;
	$: data.streamed.customers.then((res) => {
		totalCount = res.count;
	});

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));
	$: queryCustomerName = getNullableVal($page.url.searchParams.get('name'), '');

	function getUrlQueryString(pageNumber: number) {
		const query = new URLSearchParams($page.url.searchParams.toString());
		query.set('page', pageNumber.toString());
		query.set('pageSize', pageSize.toString());
		return `?${query.toString()}`;
	}
</script>

<h2 class="h3 font-bold">Customers</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Records on customers's spending</h5>
<form class="flex flex-row gap-1 mb-3 items-stretch" method="get">
	<!-- <input type="hidden" name="page" value={queryPageNumber} />
			<input type="hidden" name="pageSize" value={queryPageSize} /> -->
	<input class="input px-2" name="name" value={queryCustomerName} />
	<button type="submit" class="btn btn-sm variant-filled-tertiary grid place-items-center w-9 h-9">
		<SearchIcon class="w-5 h-5" />
	</button>
</form>
{#await data.streamed.customers}
	<LoadingDots class="w-10 h-10 text-primary-500 mx-auto my-8" />
{:then customers}
	{#if customers.data.length}
		<div class="mb-3">
			<Table
				data={customers.data}
				columns={[
					{
						accessorFn: (row) => row.name,
						id: 'name',
						cell: (info) => info.getValue(),
						header: () => 'Name'
					},
					{
						accessorFn: (row) => row.email,
						id: 'email',
						cell: (info) => info.getValue(),
						header: () => 'Email',
						size: 200
					},
					{
						accessorFn: (row) => row.city,
						id: 'city',
						cell: (info) => info.getValue(),
						header: () => 'City'
					},
					{
						accessorFn: (row) => row.country,
						id: 'country',
						cell: (info) => info.getValue(),
						header: () => 'Country'
					},
					{
						accessorFn: (row) => currencyFormatter.format(row.totalSpent),
						id: 'totalSpent',
						cell: (info) => info.getValue(),
						header: () => 'Total Spent'
					}
				]}
			/>
		</div>
	{:else}
		<div class="h-full text-error-500-400-token flex flex-col justify-center">
			<p class="text-center">No customers found</p>
		</div>
	{/if}
{/await}
{#if totalCount}
	<Pagination
		bind:currentPageNumber
		maxPage={Math.ceil(totalCount / pageSize) || 1}
		on:change={(e) => {
			goto(getUrlQueryString(e.detail));
		}}
	/>
{/if}
