<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { createSvelteTable, flexRender, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { currencyFormatter, getNullableVal } from '$lib/utils.js';
	import SearchIcon from '$lib/components/icons/SearchIcon.svelte';
	import { getPagination } from '$lib/paginate.js';

	export let data;

	type ColumnType = (typeof data.customers.data)[number];
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
		data: data.customers.data,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel()
	});

	$: options.update((old) => ({ ...old, data: data.customers.data }));

	const table = createSvelteTable(options);

	$: queryPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: queryPageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));
	$: queryCustomerName = getNullableVal($page.url.searchParams.get('name'), '');

	$: {
		$table.setPageIndex(queryPageNumber - 1);
	}
</script>

<h2 class="h3 font-bold">Customers</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Records on customers's spending</h5>
{#if data.customers.data.length}
	<div class="mb-3">
		<form class="flex flex-row gap-1 mb-3 items-stretch" method="get">
			<!-- <input type="hidden" name="page" value={queryPageNumber} />
			<input type="hidden" name="pageSize" value={queryPageSize} /> -->
			<input class="input px-2" name="name" value={queryCustomerName} />
			<button
				type="submit"
				class="btn btn-sm variant-filled-tertiary grid place-items-center w-9 h-9"
			>
				<SearchIcon class="w-5 h-5" />
			</button>
		</form>
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
		<div
			class="flex flex-row w-max rounded border border-surface-300 dark:border-surface-600 mt-2 [&>*]:border-l [&>*]:border-surface-300 dark:[&>*]:border-surface-600 ml-auto"
		>
			<button
				aria-label="previous page"
				class="w-9 h-9 grid place-items-center disabled:text-surface-300 dark:disabled:text-surface-400 hover:text-primary-400 first:border-l-0"
				disabled={$table.getState().pagination.pageIndex === 0}
				on:click={() => {
					const query = new URLSearchParams($page.url.searchParams.toString());
					query.set('page', (queryPageNumber - 1).toString());
					query.set('pageSize', queryPageSize.toString());
					goto(`?${query.toString()}`);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="15"
					height="15"
					viewBox="0 0 15 15"
					class="w-3 h-3"><path fill="currentColor" d="M3 7.5L11 0v15L3 7.5Z" /></svg
				>
			</button>
			{#each getPagination($table.getState().pagination.pageIndex, Math.ceil(data.customers.count / 10)) as pageNumber}
				{#if typeof pageNumber === 'number'}
					<button
						class="text-sm w-9 h-9 {pageNumber === $table.getState().pagination.pageIndex + 1
							? 'text-primary-500'
							: 'hover:text-primary-400'}"
						on:click={() => {
							const query = new URLSearchParams($page.url.searchParams.toString());
							query.set('page', (+pageNumber).toString());
							query.set('pageSize', queryPageSize.toString());
							goto(`?${query.toString()}`);
						}}>{pageNumber}</button
					>
				{:else}
					<span
						class="text-sm w-9 h-9 grid place-items-center text-surface-300 dark:text-surface-400"
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
				disabled={$table.getState().pagination.pageIndex ===
					Math.ceil(data.customers.count / 10) - 1}
				on:click={() => {
					const query = new URLSearchParams($page.url.searchParams.toString());
					query.set('page', (queryPageNumber + 1).toString());
					query.set('pageSize', queryPageSize.toString());
					goto(`?${query.toString()}`);
				}}
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
	</div>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">No customers found</p>
	</div>
{/if}
