<script>
	import Searchbar from './Searchbar.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import UserProfileButton from './UserProfileButton.svelte';
	import Gear from './icons/Gear.svelte';
</script>

<nav class="border-b border-1 border-surface-400-500-token">
	<div class="flex flex-row gap-2 justify-between items-center container mx-auto px-4 md:px-0 py-1">
		<div class="flex flex-row gap-1 items-center">
			<button class="hover:text-primary-400-500-token">
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
		<div class="flex flex-row gap-2 items-center">
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
