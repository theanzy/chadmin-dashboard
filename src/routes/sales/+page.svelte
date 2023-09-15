<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import LineChart from './LineChart.svelte';

	export let data;
	let overviewType: string;

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	let dataset: { x: string; y: number }[] = [];
	const unitFormatter = new Intl.NumberFormat();
	const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
	function formatYValue(y: number) {
		if (overviewType === 'revenue') {
			return currencyFormatter.format(y);
		}
		return `${unitFormatter.format(y)} Units`;
	}
	$: if (overviewType === 'revenue') {
		dataset = data.monthlySales.map((d) => ({ x: d.month, y: d.totalRevenue }));
	} else {
		dataset = data.monthlySales.map((d) => ({ x: d.month, y: d.totalUnits }));
	}
</script>

<h2 class="h3 font-bold">Overview</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Cumulative sales on the year {new Date().getUTCFullYear()}
</h5>
<button class="btn bg-surface-100-800-token border w-52 justify-between" use:popup={popupCombobox}>
	<span class="capitalize">{overviewType ?? 'Select'}</span>
	<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" class="w-3 h-3"
		><path fill="currentColor" d="M7.5 12L0 4h15l-7.5 8Z" /></svg
	>
</button>
<div class="card w-52 shadow-xl py-2 z-10" data-popup="popupCombobox">
	<ListBox rounded="rounded-none">
		<ListBoxItem bind:group={overviewType} name="overview" value="revenue">Revenue</ListBoxItem>
		<ListBoxItem bind:group={overviewType} name="overview" value="Units">Units</ListBoxItem>
	</ListBox>
	<div class="arrow bg-surface-900-100-token" />
</div>
<div class="h-[50vh] w-full">
	<LineChart {dataset} {formatYValue} />
</div>
