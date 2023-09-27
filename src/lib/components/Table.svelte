<script lang="ts">
	import { writable } from 'svelte/store';

	import { createSvelteTable, flexRender, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';

	type DataType = $$Generic<Record<string, any>>;

	export let data: DataType[] = [];
	export let columns: ColumnDef<DataType>[] = [];

	const options = writable<TableOptions<DataType>>({
		data: data,
		columns: columns,
		getCoreRowModel: getCoreRowModel()
	});

	$: {
		options.update((old) => ({ ...old, data: data }));
	}

	const table = createSvelteTable(options);
</script>

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
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
