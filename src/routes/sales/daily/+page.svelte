<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import CalendarMonth from '$lib/components/icons/CalendarMonth.svelte';
	import { currencyFormatter, getStartOfMonth, unitFormatter } from '$lib/utils.js';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/flatpickr.min.css';
	import 'flatpickr/dist/themes/dark.css';

	export let data;

	export let startDate = getStartOfMonth(new Date());
	export let endDate = new Date();

	function formatDate(date: Date) {
		return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
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

	function createCalendar(el: HTMLButtonElement) {
		const datepicker = flatpickr(el, {
			defaultDate: startDate,
			mode: 'range',
			dateFormat: 'Y-m-d',
			onChange(selectedDates) {
				if (selectedDates.length < 2) {
					return;
				}
				startDate = selectedDates[0];
				endDate = selectedDates[1];
				let query = new URLSearchParams($page.url.searchParams.toString());

				query.set('startdate', startDate.toUTCString());
				query.set('enddate', endDate.toUTCString());
				goto(`?${query.toString()}`);
			}
		});
		el.onclick = datepicker.open;
	}
</script>

<h2 class="h3 font-bold">Daily Sales</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Sales made on each day</h5>
<div class="flex flex-row w-full pr-8 justify-between">
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
	<button
		use:createCalendar
		class="flex justify-start items-center gap-1 btn btn-sm border border-neutral-400 dark:border-neutral-700 text-sm w-64"
	>
		<CalendarMonth class="w-4 h-4 text-surface-700-200-token" />
		<time class="text-surface-700-200-token">{formatDate(startDate)} to {formatDate(endDate)}</time>
	</button>
</div>
{#if data.dailySales.length}
	<div class="h-[50vh] w-full">
		<LineChart
			{dataset}
			tooltipValueGetter={(d) => {
				return {
					x: formatDate(d.x),
					y: formatYValue(d.y)
				};
			}}
		/>
	</div>
{:else}
	<p class="text-center my-20 text-rose-600">Data is not available</p>
{/if}
