<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import ToggleSortButton from './ToggleSortButton.svelte';

	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getExpandedRowModel,
		type SortDirection
	} from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';

	type DataType = $$Generic<Record<string, any>>;
	interface $$Events {
		sort: CustomEvent<{
			column: string;
			direction: SortDirection;
		}>;
	}

	type Dispatcher<TEvents extends Record<keyof TEvents, CustomEvent<any>>> = {
		[Property in keyof TEvents]: TEvents[Property]['detail'];
	};

	type SortOption = {
		sortBy: string | undefined;
		orderBy: SortDirection | undefined;
	};

	const dispatch = createEventDispatcher<Dispatcher<$$Events>>();

	export let data: DataType[] = [];
	export let columns: ColumnDef<DataType>[] = [];

	export let sort: SortOption | undefined = undefined;
	export let rowCanExpand = false;
	const options = writable<TableOptions<DataType>>({
		data: data,
		columns: columns,
		getRowCanExpand: () => rowCanExpand,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	});

	$: {
		options.update((old) => ({ ...old, data: data }));
	}
	$: {
		if (sort?.sortBy && sort.orderBy) {
			options.update((old) => {
				return {
					...old,
					state: {
						...old.state,
						sorting: [{ id: sort?.sortBy, desc: sort?.orderBy === 'desc' }]
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

	function getToggledSorting(
		sortBy: string,
		orderBy: false | SortDirection
	): { sortBy: string; orderBy: SortDirection } {
		return {
			sortBy,
			orderBy: orderBy === 'desc' ? 'asc' : 'desc'
		};
	}
</script>

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
												dispatch('sort', {
													column: header.column.columnDef.id,
													direction: getToggledSorting(
														header.column.columnDef.id,
														header.column.getIsSorted()
													).orderBy
												});
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
						<td>
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
				{#if row.getIsExpanded()}
					<tr class="!bg-surface-200-700-token">
						<td colSpan={row.getVisibleCells().length} class="table-container">
							<slot name="expandedRow" item={row.original} />
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
