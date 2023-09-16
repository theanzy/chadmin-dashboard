<script lang="ts">
	import ComboBox from '$lib/components/ComboBox.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import { currencyFormatter, unitFormatter } from '$lib/utils.js';

	export let data;

	function formatDate(date: Date) {
		return `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
	}

	let dailyType = 'revenue';

	let dataset: { x: Date; y: number }[] = [];

	function formatYValue(y: number) {
		if (dailyType === 'revenue') {
			return currencyFormatter.format(y);
		}
		return `${unitFormatter.format(y)} Units`;
	}

	$: if (dailyType === 'revenue') {
		dataset = data.dailySales.map((d) => ({ x: d.date, y: d.totalRevenue }));
	} else {
		dataset = data.dailySales.map((d) => ({ x: d.date, y: d.totalUnits }));
	}
</script>

<h2 class="h3 font-bold">Daily Sales</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Daily sales made in from</h5>
<ComboBox
	bind:value={dailyType}
	name={'monthlyType'}
	options={[
		{
			label: 'Revenue',
			value: 'revenue'
		},
		{
			label: 'Units',
			value: 'unit'
		}
	]}
/>
<div class="h-[50vh] w-full">
	<LineChart
		dataset={data.dailySales.map((d) => ({ x: d.date, y: d.totalRevenue }))}
		tooltipValueGetter={(d) => {
			return {
				x: formatDate(d.x),
				y: formatYValue(d.y)
			};
		}}
	/>
</div>
