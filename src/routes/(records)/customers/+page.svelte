<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { currencyFormatter } from '$lib/utils.js';

	export let data;
	console.log(data.customers);
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
			header: () => 'Email'
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

	const options = writable<TableOptions<ColumnType>>({
		data: data.customers.data,
		columns: defaultColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});

	const table = createSvelteTable(options);

	function getPagination(pageIndex: number, pageSize: number) {
		const middleSize = 3;
		let result = [];
		result.push(1);

		let startOffset = pageIndex;
		if (pageIndex + middleSize >= pageSize) {
			startOffset = pageSize - middleSize;
		}

		if (pageIndex < middleSize) {
			startOffset = 2;
		}

		if (pageIndex >= middleSize) {
			result.push('...');
		}
		for (let i = startOffset; i < middleSize + startOffset; i++) {
			result.push(i);
		}
		if (pageIndex + middleSize < pageSize) {
			result.push('...');
		}
		result.push(pageSize);
		return result;
	}
</script>

<h2 class="h3 font-bold">Customers</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Records on customers's spending</h5>
{#if data.customers.data.length}
	<div class="h-[80vh]">
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
				on:click={() => $table.setPageIndex((old) => old - 1)}
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
							$table.setPageIndex(+pageNumber - 1);
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
				on:click={() => $table.setPageIndex((old) => old + 1)}
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
		<p class="text-center">Data is not available</p>
	</div>
{/if}
