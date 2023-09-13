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
</script>

<svelte:head>{@html `<script>(${setInitialClassState.toString()})();</script>`}</svelte:head>

<AppShell class="min-h-screen">
	<svelte:fragment slot="pageHeader">
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Sidebar />
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
