import { getContext, setContext } from 'svelte';

type Context = Writable<boolean>;
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export function initSidebarContext() {
	const sidebarStore = localStorageStore('chadmin-sidebar', true);
	setContext('sidebar', sidebarStore);
}

export function getSidebarShown() {
	return getContext<Context>('sidebar');
}
