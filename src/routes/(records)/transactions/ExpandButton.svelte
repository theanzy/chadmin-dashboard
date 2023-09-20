<script lang="ts">
	export let onclick: () => void;
	export let isExpanded: boolean;
</script>

<button on:click={onclick} class="w-6 h-6 grid place-items-center">
	{#if isExpanded}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="w-5 h-5"
			><path
				fill="currentColor"
				d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"
			/></svg
		>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="w-5 h-5"
			><path fill="currentColor" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6l4.6-4.6Z" /></svg
		>
	{/if}
</button>
