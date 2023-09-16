<script lang="ts">
	import LineChart from '$lib/components/LineChart.svelte';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import { currencyFormatter, monthToDate, unitFormatter } from '$lib/utils.js';

	export let data;
	let overviewType = 'revenue';

	let dataset: { x: Date; y: number }[] = [];
	function formatYValue(y: number) {
		if (overviewType === 'revenue') {
			return currencyFormatter.format(y);
		}
		return `${unitFormatter.format(y)} Units`;
	}

	$: if (overviewType === 'revenue') {
		dataset = data.cumulativeSales.map((d) => ({ x: monthToDate(d.month), y: d.totalRevenue }));
	} else {
		dataset = data.cumulativeSales.map((d) => ({ x: monthToDate(d.month), y: d.totalUnits }));
	}
</script>

<h2 class="h3 font-bold">Overview</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Cumulative sales on the year {new Date().getUTCFullYear()}
</h5>
{#if data.cumulativeSales.length}
	<ComboBox
		bind:value={overviewType}
		name={'overviewType'}
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
			{dataset}
			tooltipValueGetter={(d) => {
				return {
					x: d.x.toLocaleString('default', { month: 'long' }),
					y: formatYValue(d.y)
				};
			}}
		/>
	</div>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">Data is not available</p>
	</div>
{/if}
