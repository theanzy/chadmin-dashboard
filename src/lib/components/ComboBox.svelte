<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	export let value: string;
	export let name = 'dropdown';
	export let options: {
		label: string;
		value: string;
	}[] = [];

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
</script>

<button
	class="btn text-sm border border-neutral-400 dark:border-neutral-700 w-52 justify-between"
	use:popup={popupCombobox}
>
	<span class="capitalize">{value ?? 'Select'}</span>
	<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="w-3 h-3"
		><path fill="currentColor" d="M7.5 12L0 4h15l-7.5 8Z" /></svg
	>
</button>
<div class="card text-sm w-52 shadow-xl py-2 z-10" data-popup="popupCombobox">
	<ListBox rounded="rounded-none">
		{#each options as option (option.value)}
			<ListBoxItem bind:group={value} {name} value={option.value}>{option.label}</ListBoxItem>
		{/each}
	</ListBox>
	<div class="arrow bg-surface-900-100-token" />
</div>
