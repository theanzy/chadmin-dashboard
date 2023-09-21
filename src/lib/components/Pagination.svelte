<script lang="ts">
	import { getPagination } from '$lib/paginate';
	import type { EventDispatcher } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	interface $$Events {
		change: CustomEvent<number>;
	}

	const dispatch = createEventDispatcher<EventDispatcher<$$Events>>();

	export let currentPageNumber = 1;
	export let maxPage = 1;
</script>

<div
	class="flex flex-row w-max rounded border border-surface-300 dark:border-surface-600 mt-2 [&>*]:border-l [&>*]:border-surface-300 dark:[&>*]:border-surface-600 ml-auto"
>
	<button
		aria-label="previous page"
		class="w-9 h-9 grid place-items-center disabled:text-surface-300 dark:disabled:text-surface-400 hover:text-primary-400 first:border-l-0"
		disabled={currentPageNumber - 1 === 0}
		on:click={() => {
			dispatch('change', currentPageNumber - 1);
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
	{#each getPagination(currentPageNumber - 1, maxPage) as pageNumber}
		{#if typeof pageNumber === 'number'}
			<button
				class="text-sm w-9 h-9 {pageNumber === currentPageNumber
					? 'text-primary-500'
					: 'hover:text-primary-400'}"
				on:click={() => {
					dispatch('change', +pageNumber);
				}}>{pageNumber}</button
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
		disabled={currentPageNumber === maxPage || maxPage <= 1}
		on:click={() => {
			dispatch('change', currentPageNumber + 1);
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
