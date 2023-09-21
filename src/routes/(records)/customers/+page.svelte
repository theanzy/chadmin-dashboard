<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { createSvelteTable, flexRender, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { currencyFormatter, getNullableVal } from '$lib/utils.js';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;

	type ColumnType = (typeof data.streamed.customers.data)[number];
	const defaultColumns: ColumnDef<ColumnType>[] = [
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
	];

	const options = writable<TableOptions<any>>({
		data: [],
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel()
	});

	let totalCount = 0;

	$: data.streamed.customers.then((res) => {
		options.update((old) => ({ ...old, data: res.data }));
		totalCount = res.count;
	});

	const table = createSvelteTable(options);

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));
	$: queryCustomerName = getNullableVal($page.url.searchParams.get('name'), '');

	$: {
		$table.setPageIndex(currentPageNumber - 1);
	}

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
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		class="w-10 h-10 text-primary-500 mx-auto my-8"
		><circle cx="12" cy="2" r="0" fill="currentColor"
			><animate
				attributeName="r"
				begin="0"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"
			><animate
				attributeName="r"
				begin="0.125s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"
			><animate
				attributeName="r"
				begin="0.25s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"
			><animate
				attributeName="r"
				begin="0.375s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"
			><animate
				attributeName="r"
				begin="0.5s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"
			><animate
				attributeName="r"
				begin="0.625s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"
			><animate
				attributeName="r"
				begin="0.75s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"
			><animate
				attributeName="r"
				begin="0.875s"
				calcMode="spline"
				dur="1s"
				keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
				repeatCount="indefinite"
				values="0;2;0;0"
			/></circle
		></svg
	>
{:then customers}
	{#if customers.data.length}
		<div class="mb-3">
			<div class="table-container">
				<table class="table table-hover">
					<thead class="text-sm">
						{#each $table.getHeaderGroups() as headerGroup}
							<tr>
								{#each headerGroup.headers as header}
									<th>
										{#if !header.isPlaceholder}
											<svelte:component
												this={flexRender(header.column.columnDef.header, header.getContext())}
											/>
										{/if}
									</th>
								{/each}
							</tr>
						{/each}
					</thead>
					<tbody>
						{#each $table.getRowModel().rows as row}
							<tr>
								{#each row.getVisibleCells() as cell}
									<td>
										<svelte:component
											this={flexRender(cell.column.columnDef.cell, cell.getContext())}
										/>
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
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
		maxPage={Math.ceil(totalCount / pageSize) - 1 || 1}
		on:change={(e) => {
			goto(getUrlQueryString(e.detail));
		}}
	/>
{/if}
