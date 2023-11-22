<script lang="ts">
	import '../app.postcss';

	import { AppShell, Modal, setInitialClassState } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { initSidebarContext } from '$lib/context/sidebar';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initSidebarContext();

	function loadInitialClassState() {
		const classList = document.documentElement.classList;
		const modeCurrent = localStorage.getItem('modeCurrent');
		if (!modeCurrent) {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				classList.add('dark');
			}
			return;
		}
		if (modeCurrent === 'false') {
			classList.add('dark');
		} else {
			setInitialClassState();
		}
	}
</script>

<svelte:head>{@html `<script>(${loadInitialClassState.toString()})();</script>`}</svelte:head>

<Modal />
<AppShell class="min-h-screen">
	<svelte:fragment slot="pageHeader">
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Sidebar />
	</svelte:fragment>
	<section class="px-4 py-2">
		<slot />
	</section>
</AppShell>
