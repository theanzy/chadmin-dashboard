<script>
	import Searchbar from './Searchbar.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import UserProfileButton from './UserProfileButton.svelte';
	import Gear from './icons/Gear.svelte';
	import { getSidebarShown } from '$lib/context/sidebar';
	const isSidebarShown = getSidebarShown();
</script>

<nav class="border-b border-1 border-surface-200 dark:border-surface-500">
	<div class="flex flex-row gap-5 items-center px-2 py-1">
		<div class="flex flex-col md:flex-row gap-1 items-center flex-1 md:flex-0">
			<button
				class="hover:text-primary-400-500-token hidden md:block"
				on:click={() => {
					isSidebarShown.update((x) => !x);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="w-7 h-7"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 8h12M6 12h12M6 16h12"
					/></svg
				>
			</button>
			<Searchbar />
		</div>
		<div class="flex flex-row gap-2 items-center ml-auto">
			<ThemeToggle />
			<button
				class="btn-icon btn-icon-sm relative overflow-hidden border border-1 border-transparent text-surface-700-200-token"
			>
				<Gear class="w-6 h-6" />
			</button>
			<UserProfileButton />
		</div>
	</div>
</nav>
