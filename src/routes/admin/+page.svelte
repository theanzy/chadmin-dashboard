<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pagination from '$lib/components/Pagination.svelte';
	import { getNullableVal } from '$lib/utils.js';
	import {
		getCoreRowModel,
		type ColumnDef,
		type TableOptions,
		createSvelteTable,
		flexRender
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';

	export let data;
	type ColumnType = (typeof data.admins.data)[number];

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));

	const defaultColumns: ColumnDef<ColumnType>[] = [
		{
			id: 'expander',
			header: () => null
		},
		{
			accessorFn: (row) => row.id,
			id: 'id',
			cell: (info) => info.getValue(),
			header: () => 'ID'
		},

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
			accessorFn: (row) => row.city,
			id: 'country',
			cell: (info) => info.getValue(),
			header: () => 'Country'
		}
	];

	const options = writable<TableOptions<ColumnType>>({
		data: data.admins.data,
		columns: defaultColumns,
		manualSorting: true,
		getCoreRowModel: getCoreRowModel()
	});
	const table = createSvelteTable(options);

	$: {
		options.update((old) => ({ ...old, data: data.admins.data }));
	}

	function getUrlQueryString({
		pageNumber,
		sorting
	}: {
		pageNumber: number;
		sorting?: { sortBy: string; orderBy: string };
	}) {
		const query = new URLSearchParams($page.url.searchParams.toString());
		query.set('page', pageNumber.toString());
		query.set('pageSize', pageSize.toString());
		if (sorting) {
			query.set('sort_by', sorting.sortBy);
			query.set('order_by', sorting.orderBy);
		}
		return `?${query.toString()}`;
	}
</script>

<h2 class="h3 font-bold">Admins</h2>
<h5 class="h6 text-surface-600-300-token mb-5">List of administrators</h5>

{#if data.admins.data.length}
	<div class="mb-3">
		<div class="table-container">
			<table class="table table-hover">
				<thead class="text-sm">
					{#each $table.getHeaderGroups() as headerGroup}
						<tr>
							{#each headerGroup.headers as header}
								<th class="group relative">
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
								{#if cell.column.columnDef.cell}
									<td>
										<svelte:component
											this={flexRender(cell.column.columnDef.cell, cell.getContext())}
										/>
									</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<Pagination
		bind:currentPageNumber
		maxPage={Math.ceil(data.admins.count / pageSize) || 1}
		on:change={(e) => {
			goto(getUrlQueryString({ pageNumber: e.detail }));
		}}
	/>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">No transactions found</p>
	</div>
{/if}
