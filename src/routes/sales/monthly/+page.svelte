<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import { currencyFormatter, unitFormatter } from '$lib/utils.js';

	export let data;
	let monthlyType = 'revenue';

	let dataset: { x: string; y: number }[] = [];

	function formatYValue(y: number) {
		if (monthlyType === 'revenue') {
			return currencyFormatter.format(y);
		}
		return `${unitFormatter.format(y)} Units`;
	}
	$: if (monthlyType === 'revenue') {
		dataset = data.monthlySales.map((d) => ({ x: d.month, y: d.totalRevenue }));
	} else {
		dataset = data.monthlySales.map((d) => ({ x: d.month, y: d.totalUnits }));
	}
</script>

<h2 class="h3 font-bold">Overview</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Cumulative sales on the year {new Date().getUTCFullYear()}
</h5>
<ComboBox
	bind:value={monthlyType}
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
	<LineChart {dataset} {formatYValue} />
</div>
