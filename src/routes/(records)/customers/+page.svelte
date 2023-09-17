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

	const rerender = () => {
		options.update((options) => ({
			...options,
			data: data.customers.data
		}));
	};
	const table = createSvelteTable(options);
</script>

<h2 class="h3 font-bold">Customers</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Records on customers's spending</h5>
{#if data.customers.data.length}
	<div class="h-[80vh]">
		<div class="table-container">
			<table class="table table-hover">
				<thead>
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

		<button
			class="btn btn-sm variant-outline-secondary"
			disabled={$table.getState().pagination.pageIndex === 0}
			on:click={() => {
				$table.setPageIndex((i) => i - 1);
			}}>Prev</button
		>
		{#each Array(5)
			.fill(0)
			.map((_, i) => i + 1) as pageNumber}
			<button
				class="border-y border-neutral-300 dark:border-neutral-600 text-sm w-8 h-8 first:border-l first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br {pageNumber ===
				$table.getState().pagination.pageIndex + 1
					? 'text-primary-500'
					: ''}"
				disabled={$table.getState().pagination.pageIndex === data.customers.count - 2}
				on:click={() => {
					$table.setPageIndex(pageNumber - 1);
				}}>{pageNumber}</button
			>
		{/each}
		<button
			class="btn btn-sm variant-outline-secondary"
			disabled={$table.getState().pagination.pageIndex === data.customers.count - 2}
			on:click={() => {
				$table.setPageIndex((i) => i + 1);
			}}>Next</button
		>
		<input
			class="input"
			type="number"
			on:change={(e) => {
				$table.setPageIndex(e.currentTarget.valueAsNumber);
			}}
		/>
	</div>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">Data is not available</p>
	</div>
{/if}
