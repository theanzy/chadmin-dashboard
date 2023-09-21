<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currencyFormatter, formatDate, getNullableVal } from '$lib/utils.js';
	import {
		getCoreRowModel,
		type ColumnDef,
		type TableOptions,
		createSvelteTable,
		flexRender,
		getExpandedRowModel,
		type SortDirection
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';
	import ExpandButton from './ExpandButton.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import FilterForm from './FilterForm.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import ToggleSortButton from '$lib/components/ToggleSortButton.svelte';
	import Filter from '$lib/components/icons/Filter.svelte';
	import ClearFilterIcon from '$lib/components/icons/ClearFilterIcon.svelte';

	export let data;
	const modalStore = getModalStore();

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
			header: () => 'Date',
			enableSorting: true
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
			enableSorting: true,
			cell: (info) => info.getValue(),
			header: () => 'Amount'
		}
	];

	const options = writable<TableOptions<ColumnType>>({
		data: data.transactions.data,
		columns: defaultColumns,
		manualSorting: true,
		getRowCanExpand: () => true,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	});

	function getToggledSorting(sortBy: string, orderBy: false | SortDirection) {
		return {
			sortBy,
			orderBy: orderBy === 'desc' ? 'asc' : 'desc'
		};
	}

	$: {
		const sortBy = getNullableVal($page.url.searchParams.get('sort_by'), undefined);
		const orderBy = getNullableVal($page.url.searchParams.get('order_by'), undefined);

		if (sortBy && orderBy) {
			options.update((old) => {
				return {
					...old,
					state: {
						...old.state,
						sorting: [{ id: sortBy, desc: orderBy === 'desc' }]
					}
				};
			});
		} else {
			options.update((old) => {
				return {
					...old,
					state: {
						...old.state,
						sorting: []
					}
				};
			});
		}
	}

	const table = createSvelteTable(options);

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));

	$: {
		$table.setPageIndex(currentPageNumber - 1);
	}
	$: {
		options.update((old) => ({ ...old, data: data.transactions.data }));
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

	let modalComponent: ModalComponent = {
		// Pass a reference to your custom component
		ref: FilterForm,
		// Add the component properties as key/value pairs
		slot: '<p></p>'
	};

	const modal: ModalSettings = {
		type: 'component',
		// Pass the component directly:
		component: modalComponent
	};
</script>

<h2 class="h3 font-bold">Transaction</h2>
<h5 class="h6 text-surface-600-300-token mb-5">History of transactions made</h5>
<div class="flex mb-3">
	<button
		class="btn variant-outline-surface ml-auto mr-2"
		on:click={() => goto($page.url.pathname)}
	>
		<ClearFilterIcon class="w-6 h-6 mr-1" />
		<span>Clear Filters</span>
	</button>
	<button class="btn variant-outline-surface" on:click={() => modalStore.trigger(modal)}
		><Filter class="w-6 h-6 mr-1" />
		<span>Filters</span>
	</button>
</div>
{#if data.transactions.data.length}
	<div class="mb-3">
		<div class="table-container">
			<table class="table table-hover">
				<thead class="text-sm">
					{#each $table.getHeaderGroups() as headerGroup}
						<tr>
							{#each headerGroup.headers as header}
								<th class="group relative">
									{#if !header.isPlaceholder}
										{#if header.column.columnDef.enableSorting}
											<ToggleSortButton
												sortOrder={header.column.getIsSorted() || null}
												on:click={() => {
													if (header.column.columnDef.id) {
														goto(
															getUrlQueryString({
																pageNumber: 1,
																sorting: getToggledSorting(
																	header.column.columnDef.id,
																	header.column.getIsSorted()
																)
															})
														);
													}
												}}
											>
												<svelte:component
													this={flexRender(header.column.columnDef.header, header.getContext())}
												/>
											</ToggleSortButton>
										{:else}
											<svelte:component
												this={flexRender(header.column.columnDef.header, header.getContext())}
											/>
										{/if}
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
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<Pagination
		bind:currentPageNumber
		maxPage={Math.ceil(data.transactions.count / pageSize) || 1}
		on:change={(e) => {
			goto(getUrlQueryString({ pageNumber: e.detail }));
		}}
	/>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">No transactions found</p>
	</div>
{/if}
