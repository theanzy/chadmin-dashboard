<script>
	import { page } from '$app/stores';

	import { getSidebarShown } from '$lib/context/sidebar';
	import { slide } from 'svelte/transition';

	import Home from './icons/Home.svelte';
	import GiftBag from './icons/GiftBag.svelte';
	import TwoPeople from './icons/TwoPeople.svelte';
	import Transaction from './icons/Transaction.svelte';
	import Geo from './icons/Geo.svelte';
	import BarChartIcon from './icons/BarChartIcon.svelte';
	import CalendarDate from './icons/CalendarDate.svelte';
	import CalendarMonth from './icons/CalendarMonth.svelte';
	import PieChartIcon from './icons/PieChartIcon.svelte';
	import Admin from './icons/Admin.svelte';
	import LineChartIcon from './icons/LineChartIcon.svelte';

	const isSidebarShown = getSidebarShown();

	const sidebarNavItems = [
		{
			label: 'Home',
			icon: Home,
			href: '/'
		},
		{
			label: 'Records'
		},
		{
			label: 'Products',
			icon: GiftBag,
			href: '/products'
		},
		{
			label: 'Customers',
			icon: TwoPeople,
			href: '/customers'
		},
		{
			label: 'Transaction',
			icon: Transaction,
			href: '/transactions'
		},
		{
			label: 'Geography',
			icon: Geo,
			href: '/geography'
		},
		{
			label: 'Sales'
		},
		{
			label: 'Overview',
			icon: BarChartIcon,
			href: '/sales/overview'
		},
		{
			label: 'Daily',
			icon: CalendarDate,
			href: '/sales/daily'
		},
		{
			label: 'Monthly',
			icon: CalendarMonth,
			href: '/sales/monthly'
		},
		{
			label: 'Breakdown',
			icon: PieChartIcon,
			href: '/sales/breakdown'
		},
		{
			label: 'Management'
		},
		{
			label: 'Admin',
			icon: Admin,
			href: '/admin'
		},
		{
			label: 'Performance',
			icon: LineChartIcon,
			href: '/performance'
		}
	];
</script>

<svelte:window
	on:keydown={(e) => {
		if (window.innerWidth > 768) {
			return;
		}
		if (e.key === 'Escape') {
			isSidebarShown.set(false);
		}
	}}
/>
{#if $isSidebarShown}
	<nav
		transition:slide={{ axis: 'x', duration: 100 }}
		class="fixed md:static w-[50vw] z-10 md:z-0 border-r-0 md:border-r border-surface-200 dark:border-surface-500 h-full bg-surface-100-800-token md:w-44"
	>
		<div class="hidden md:flex px-2 py-4 flex-row items-center relative">
			<span class="font-bold text-center w-full"> CHADMIN </span>
			<button
				class="ml-5 text-surface-500-400-token hover:text-primary-400 absolute right-3"
				aria-label="Hide Sidebar"
				on:click={() => {
					isSidebarShown.set(false);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="w-5 h-5"
					><path
						fill="currentColor"
						d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z"
					/></svg
				>
			</button>
		</div>
		<button
			class="md:hidden absolute top-3 right-3 hover:text-primary-500"
			on:click={() => {
				isSidebarShown.set(false);
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="w-6 h-6"
				><path
					fill="currentColor"
					d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"
				/></svg
			>
		</button>
		<div role="list" class="flex flex-col text-surface-700-200-token pt-6 md:pt-0">
			{#each sidebarNavItems as item (item.label)}
				{#if item.href}
					{@const isActive = $page.url.pathname === item.href}
					<a
						href={item.href}
						class="py-3 px-4 {isActive
							? 'text-primary-500'
							: 'hover:text-primary-400'} flex items-center gap-2"
					>
						<svelte:component this={item.icon} class="h-6 w-6" />
						<p class="text-sm">{item.label}</p>
					</a>
				{:else}
					<p class="text-sm font-medium px-4 mt-4 mb-1 text-surface-600-300-token">
						{item.label}
					</p>
				{/if}
			{/each}
		</div>
	</nav>
{/if}
