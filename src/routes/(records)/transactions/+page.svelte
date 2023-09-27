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
	import Table from '$lib/components/Table.svelte';

	export let data;
	const modalStore = getModalStore();

	$: sortBy = getNullableVal($page.url.searchParams.get('sort_by'), undefined);
	$: orderBy = getNullableVal($page.url.searchParams.get('order_by'), undefined);

	$: currentPageNumber = getNullableVal($page.url.searchParams.get('page'), 1, (x) => parseInt(x));
	$: pageSize = getNullableVal($page.url.searchParams.get('pageSize'), 10, (x) => parseInt(x));

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
		<Table
			data={data.transactions.data}
			rowCanExpand={true}
			columns={[
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
			]}
			sort={{
				sortBy: sortBy,
				orderBy: orderBy
			}}
			on:sort={(e) => {
				goto(
					getUrlQueryString({
						pageNumber: 1,
						sorting: {
							orderBy: e.detail.direction,
							sortBy: e.detail.column
						}
					})
				);
			}}
		>
			<div slot="expandedRow" let:item>
				{#if item.products.length}
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
							{#each item.products as product}
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
			</div>
		</Table>
		<p class="p-7" />
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
