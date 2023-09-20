<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getPagination } from '$lib/paginate.js';
	import { currencyFormatter, formatDate, getNullableVal } from '$lib/utils.js';
	import {
		getCoreRowModel,
		type ColumnDef,
		type TableOptions,
		createSvelteTable,
		flexRender,
		getExpandedRowModel
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import ExpandButton from './ExpandButton.svelte';

	export let data;

	type ColumnType = (typeof data.transactions.data)[number];
	const defaultColumns: ColumnDef<ColumnType>[] = [
		{
			id: 'expander',
			header: () => null,
			cell: ({ row }) => {
				return flexRender(ExpandButton, {
					onclick: row.getToggleExpandedHandler(),
					isExpanded: row.getIsExpanded()
				});
			}
		},
		{
			accessorFn: (row) => row.transactionId,
			id: 'id',
			cell: (info) => info.getValue(),
			header: () => 'ID'
		},
		{
			accessorFn: (row) => formatDate(row.createdAt),
			id: 'date',
			cell: (info) => info.getValue(),
			header: () => 'Date'
		},
		{
			accessorFn: (row) => row.customer,
			id: 'customer',
			cell: (info) => info.getValue(),
			header: () => 'Customer',
			maxSize: 10
		},
		{
			accessorFn: (row) => row.affiliate,
			id: 'affiliate',
			cell: (info) => info.getValue(),
			header: () => 'Affiliate',
			maxSize: 10
		},
		{
			accessorFn: (row) => currencyFormatter.format(row.amount),
			id: 'amount',
			cell: (info) => info.getValue(),
			header: () => 'Amount'
		}
	];

	const options = writable<TableOptions<any>>({
		data: data.transactions.data,
		columns: defaultColumns,
		getRowCanExpand: () => true,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	});

	const table = createSvelteTable(options);

	$: queryPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: queryPageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));

	$: {
		$table.setPageIndex(queryPageNumber - 1);
	}
	$: {
		options.update((old) => ({ ...old, data: data.transactions.data }));
	}
	$: {
		console.log($table.getRowModel().rows);
	}

	function getUrlQueryString(pageNumber: number) {
		const query = new URLSearchParams($page.url.searchParams.toString());
		query.set('page', pageNumber.toString());
		query.set('pageSize', queryPageSize.toString());
		return `?${query.toString()}`;
	}
</script>

<h2 class="h3 font-bold">Transaction</h2>
<h5 class="h6 text-surface-600-300-token mb-5">History of transactions made</h5>
{#if data.transactions.data.length}
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
								{#if cell.column.columnDef.cell}
									<td>
										<svelte:component
											this={flexRender(cell.column.columnDef.cell, cell.getContext())}
										/>
									</td>
								{/if}
							{/each}
						</tr>
						{#if row.getIsExpanded()}
							<tr class="!bg-surface-200-700-token">
								<td colSpan={row.getVisibleCells().length} class="table-container">
									{#if row.original.products.length}
										<h6 class="h6 font-semibold">Details</h6>
										<p class="mb-2 text-surface-600-300-token">Products sold in this transaction</p>
										<table class="table-compact">
											<thead>
												<tr>
													<th>ID</th>
													<th>Name</th>
													<th>Quantity</th>
													<th>Price</th>
												</tr>
											</thead>
											<tbody class="!text-xs">
												{#each row.original.products as product}
													<tr class="!bg-surface-200-700-token">
														<td>{product.id}</td>
														<td>{product.name}</td>
														<td>{product.quantity}</td>
														<td>{currencyFormatter.format(product.price)}</td></tr
													>
												{/each}
											</tbody>
										</table>
									{/if}
								</td>
							</tr>
							<!-- {#if row.} -->

							<!-- {/if} -->
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
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
		{#each getPagination(queryPageNumber - 1, Math.ceil(data.transactions.count / 10) - 1) as pageNumber}
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
			disabled={queryPageNumber === Math.ceil(data.transactions.count / 10) - 1}
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
		<p class="text-center">No transactions found</p>
	</div>
{/if}
