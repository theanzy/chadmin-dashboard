<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// your script goes here

	interface $$Events {
		click: CustomEvent<any>;
	}

	type Dispatcher<TEvents extends Record<keyof TEvents, CustomEvent<any>>> = {
		[Property in keyof TEvents]: TEvents[Property]['detail'];
	};
	const dispatch = createEventDispatcher<Dispatcher<$$Events>>();
	export let sortOrder: 'desc' | 'asc' | null = null;
</script>

<button
	class="flex"
	on:click={(e) => {
		dispatch('click');
	}}
>
	<slot />
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 16 16"
		class="w-5 h-5 ml-1 {sortOrder === null
			? 'invisible'
			: 'visible'} group-hover:visible transition {sortOrder === 'desc' ? 'rotate-180' : ''}"
		><path
			fill="currentColor"
			d="M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042a.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z"
		/></svg
	>
</button>
