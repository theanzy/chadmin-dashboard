<script lang="ts">
	import DonutChart from '$lib/components/DonutChart.svelte';

	export let data;

	let dataset = data.sales.map((d) => ({ label: d.category, value: d.totalRevenue + 20 }));
</script>

<h2 class="h3 font-bold">Sales Breakdown</h2>
<h5 class="h6 text-surface-600-300-token mb-5">
	Sales revenue breakdown for the year {new Date().getUTCFullYear()}
</h5>

{#if data.sales.length}
	<div class="h-[80vh]">
		<DonutChart {dataset} />
	</div>
{:else}
	<div class="h-full text-error-500-400-token flex flex-col justify-center">
		<p class="text-center">Data is not available</p>
	</div>
{/if}
