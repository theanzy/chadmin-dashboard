<script lang="ts">
	import * as d3 from 'd3';
	import LineChart from './LineChart.svelte';
	export let data;
	const dataset = data.monthlySales.map((d, i) => ({
		month: d.month,
		value: d.totalUnits
	}));
</script>

<h2 class="h3 font-bold">Overview</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Cumulative sales on the year {new Date().getUTCFullYear()}
</h5>
<div class="h-[50vh] w-full">
	<LineChart dataset={dataset.map((d) => ({ x: d.month, y: d.value }))} />
</div>
