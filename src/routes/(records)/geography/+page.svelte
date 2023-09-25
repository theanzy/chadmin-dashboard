<script>
	import Choropleth from '$lib/components/Choropleth.svelte';
	export let data;
</script>

<h2 class="h3 font-bold">Geography</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Customers by country</h5>
<div class="h-[40vw] max-h-[600px]">
	<Choropleth dataset={data.customers} />
</div>
