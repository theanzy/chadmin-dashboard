<script lang="ts">
	import { page } from '$app/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import { getNullableVal } from '$lib/utils';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();

	export let transactionId: string | undefined = getNullableVal(
		$page.url.searchParams.get('id'),
		undefined
	);
	export let customer: string | undefined = getNullableVal(
		$page.url.searchParams.get('customer'),
		undefined
	);
	export let affiliate: string | undefined = getNullableVal(
		$page.url.searchParams.get('affiliate'),
		undefined
	);
	export let minPrice = getNullableVal($page.url.searchParams.get('minPrice'), undefined, Number);
	export let maxPrice = getNullableVal($page.url.searchParams.get('maxPrice'), undefined, Number);

	function handleSubmit() {
		const query = new URLSearchParams();
		if (transactionId?.length) {
			query.set('id', transactionId.toString());
		}
		if (customer?.length) {
			query.set('customer', customer);
		}
		if (affiliate?.length) {
			query.set('affiliate', affiliate);
		}
		if (minPrice !== undefined) {
			query.set('minPrice', minPrice.toString());
		}
		if (maxPrice !== undefined) {
			query.set('maxPrice', maxPrice.toString());
		}
		goto(`?${query.toString()}`);
		modalStore.close();
	}
</script>

<div
	class="bg-surface-100-800-token border border-surface-300-600-token rounded py-6 px-6 flex flex-col gap-5"
>
	<h4 class="h4 font-bold mb-1">Filters</h4>

	<div class="flex flex-col gap-1">
		<label for="transactionId">Transaction ID</label>
		<input
			id="transactionId"
			class="input px-2 py-1"
			type="text"
			placeholder="Transaction ID"
			bind:value={transactionId}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="customer">Customer</label>
		<input
			id="customer"
			class="input px-2 py-1"
			type="text"
			placeholder="Customer Name"
			bind:value={customer}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="affiliate">Affiliate</label>
		<input
			id="affiliate"
			class="input px-2 py-1"
			type="text"
			placeholder="Affiliate Name"
			bind:value={affiliate}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<p>Price Range</p>
		<div class="flex flex-row gap-2">
			<input
				min={0}
				id="minPrice"
				class="input px-2 py-1"
				type="number"
				placeholder="Min"
				bind:value={minPrice}
			/>
			<input
				min={0}
				id="maxPrice"
				class="input px-2 py-1"
				type="number"
				placeholder="Max"
				bind:value={maxPrice}
			/>
		</div>
	</div>

	<button on:click={handleSubmit} type="button" class="btn variant-filled-primary w-40 ml-auto"
		>Apply</button
	>
</div>
