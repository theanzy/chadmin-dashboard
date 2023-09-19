<script>
	import SearchIcon from './icons/SearchIcon.svelte';
</script>

<label
	class="w-full md:w-max group flex gap-2 items-center focus-within:outline outline-1 rounded-sm outline-surface-800 dark:outline-surface-400 text-sm px-1 bg-surface-200-700-token"
>
	<SearchIcon class="w-5 h-5" />
	<input
		class="h-full outline-none bg-transparent py-1 w-full"
		title="Search"
		type="text"
		placeholder="Search"
	/>
</label>
