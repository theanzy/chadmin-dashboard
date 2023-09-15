<script lang="ts">
	import '../app.postcss';

	import { AppShell, setInitialClassState } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';

	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { initSidebarContext } from '$lib/context/sidebar';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initSidebarContext();

	function loadInitialClassState() {
		const classList = document.documentElement.classList;
		const modeCurrent = localStorage.getItem('modeCurrent');
		if (modeCurrent === 'false') {
			classList.add('dark');
		} else {
			setInitialClassState();
		}
	}
</script>

<svelte:head>{@html `<script>(${loadInitialClassState.toString()})();</script>`}</svelte:head>

<AppShell class="min-h-screen">
	<svelte:fragment slot="pageHeader">
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Sidebar />
	</svelte:fragment>
	<section class="px-4 py-2 flex-1">
		<slot />
	</section>
	<svelte:fragment slot="pageFooter">
		<div class="bg-surface-50-900-token">Page Footer</div>
	</svelte:fragment>
</AppShell>
