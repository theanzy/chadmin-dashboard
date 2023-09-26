<script lang="ts">
	import { currencyFormatter, unitFormatter } from '$lib/utils.js';

	// your script goes here
	export let data;
</script>

<h2 class="h3 font-bold">Dashboard</h2>
<h5 class="h6 text-surface-600-300-token mb-5">Welcome to your dashboard</h5>

<div class="grid grid-cols-6 grid-rows-6 gap-4">
	<div
		class="flex flex-col border border-surface-300-600-token bg-neutral-200 dark:bg-surface-800 shadow-sm p-4 gap-y-4 justify-between rounded"
	>
		<div class="flex flex-row justify-between items-center text-surface-600-300-token">
			<p class="text-sm">Total Customers</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
				class="w-6 h-6"
				><path
					fill="currentColor"
					d="M30.27 25c-.24 0-.49-.04-.73-.12A2.211 2.211 0 0 1 28 22.75v-2.81c-2.26-.36-4-2.33-4-4.69v-6.5C24 6.13 26.13 4 28.75 4h11.5C42.87 4 45 6.13 45 8.75v6.5c0 2.62-2.13 4.75-4.75 4.75h-5.12l-3.08 4.1c-.44.58-1.09.9-1.78.9ZM28.75 6.5c-1.24 0-2.25 1.01-2.25 2.25v6.5c0 1.24 1.01 2.25 2.25 2.25h1.75V22l3.38-4.5h6.38c1.24 0 2.25-1.01 2.25-2.25v-6.5c0-1.24-1.01-2.25-2.25-2.25H28.75ZM16 27.5c-4.14 0-7.5-3.36-7.5-7.5c0-4.14 3.36-7.5 7.5-7.5c4.14 0 7.5 3.36 7.5 7.5c0 4.14-3.36 7.5-7.5 7.5ZM16 15c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5ZM3 34.79c0 .09.15 9.21 13 9.21s13-9.12 13-9.21v-1.04c0-2.07-1.68-3.75-3.75-3.75H6.75C4.68 30 3 31.68 3 33.75v1.04Zm2.5-1.04c0-.69.56-1.25 1.25-1.25h18.5c.69 0 1.25.56 1.25 1.25v1.03c0 .27-.22 6.72-10.5 6.72S5.5 35.05 5.5 34.79v-1.04Z"
				/></svg
			>
		</div>
		<p class="font-bold text-2xl dark:text-tertiary-700 text-tertiary-600">
			{unitFormatter.format(data.customers.totalCustomers)}
		</p>
		<div class="flex justify-between items-center text-sm text-surface-600-300-token">
			<p
				class={data.customers.changePercentage > 0
					? 'dark:text-tertiary-900-300-token'
					: 'text-red-700 text-tertiary-600'}
			>
				{data.customers.changePercentage > 0
					? `+${data.customers.changePercentage}%`
					: `${data.customers.changePercentage}%`}
			</p>
			<p>Since last month</p>
		</div>
	</div>
	<div
		class="flex flex-col border border-surface-300-600-token bg-neutral-200 dark:bg-surface-800 shadow-sm p-4 gap-y-4 justify-between rounded"
	>
		<div class="flex flex-row justify-between items-center text-surface-600-300-token">
			<p class="text-sm">Top Sales</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="w-6 h-6"
				><path
					fill="currentColor"
					d="M7 21v-2h4v-3.1q-1.225-.275-2.188-1.038T7.4 12.95q-1.875-.225-3.138-1.637T3 8V7q0-.825.588-1.413T5 5h2V3h10v2h2q.825 0 1.413.588T21 7v1q0 1.9-1.263 3.313T16.6 12.95q-.45 1.15-1.413 1.913T13 15.9V19h4v2H7Zm0-10.2V7H5v1q0 .95.55 1.713T7 10.8Zm10 0q.9-.325 1.45-1.088T19 8V7h-2v3.8Z"
				/></svg
			>
		</div>
		<div class=" dark:text-tertiary-700 text-tertiary-600">
			<p class="font-bold text-2xl">
				{data.topSales.name}
			</p>
		</div>
		<div class="flex justify-between items-center text-sm text-surface-600-300-token">
			<p class="text-tertiary-700-200-token">
				{currencyFormatter.format(data.topSales.salesMade)}
			</p>
			<p>This month</p>
		</div>
	</div>
	<div
		class="flex flex-col border border-surface-300-600-token bg-neutral-200 dark:bg-surface-800 shadow-sm p-4 gap-y-4 justify-between rounded"
	>
		<div class="flex flex-row justify-between items-center text-surface-600-300-token">
			<p class="text-sm">Monthly Sales</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
				class="w-6 h-6"
				><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"
					><path d="M41 14L24 4L7 14v20l17 10l17-10V14Z" /><path
						stroke-linecap="round"
						d="M24 22v8m8-12v12m-16-4v4"
					/></g
				></svg
			>
		</div>
		<div class="dark:text-tertiary-700 text-tertiary-600">
			<p class="font-bold text-2xl">
				{currencyFormatter.format(data.monthlySales.salesMade)}
			</p>
		</div>
		<div class="flex justify-between items-center text-sm text-surface-600-300-token">
			<p
				class={data.monthlySales.changePercentage > 0
					? 'dark:text-tertiary-900-300-t7ke text-tertiary-600n'
					: 'text-red-600'}
			>
				{data.monthlySales.changePercentage > 0
					? `+${data.monthlySales.changePercentage}%`
					: `${data.monthlySales.changePercentage}%`}
			</p>
			<p>Since last month</p>
		</div>
	</div>
	<div
		class="flex flex-col border border-surface-300-600-token bg-neutral-200 dark:bg-surface-800 shadow-sm p-4 gap-y-4 justify-between rounded"
	>
		<div class="flex flex-row justify-between items-center text-surface-600-300-token">
			<p class="text-sm">Top Market</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 48 48"
				class="w-6 h-6"
				><g fill="currentColor"
					><path
						fill-rule="evenodd"
						d="M9.263 6c-.378 0-.715.262-.845.656L6.11 13.667a2.2 2.2 0 0 0-.11.687v2.789C6 18.72 7.151 20 8.571 20c1.42 0 2.572-1.28 2.572-2.857c0 1.578 1.151 2.857 2.571 2.857c1.42 0 2.572-1.28 2.572-2.857c0 1.578 1.151 2.857 2.571 2.857c1.42 0 2.57-1.278 2.572-2.855C21.429 18.722 22.58 20 24 20c1.42 0 2.571-1.28 2.571-2.857c0 1.578 1.152 2.857 2.572 2.857c1.42 0 2.57-1.278 2.571-2.855c.001 1.577 1.152 2.855 2.572 2.855c1.42 0 2.571-1.28 2.571-2.857c0 1.578 1.151 2.857 2.572 2.857C40.849 20 42 18.72 42 17.143v-2.789a2.2 2.2 0 0 0-.11-.687l-2.308-7.01c-.13-.395-.467-.657-.845-.657H9.263Z"
						clip-rule="evenodd"
					/><path
						fill-rule="evenodd"
						d="M10 21.23V29H7.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h33a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H38v-7.77a3.916 3.916 0 0 1-1.143-.703a3.953 3.953 0 0 1-.857.576V29H12v-7.897a3.953 3.953 0 0 1-.857-.576c-.336.295-.72.535-1.143.703Zm26-1.957c.085-.085.165-.176.24-.273H36v.273ZM37.474 19a2.75 2.75 0 0 0 .526.519V19h-.526ZM10 19.519a2.63 2.63 0 0 0 .526-.519H10v.519ZM11.76 19H12v.273a2.766 2.766 0 0 1-.24-.273ZM8.5 33a.5.5 0 0 0-.5.5V41a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1v-7.5a.5.5 0 0 0-.5-.5h-31Z"
						clip-rule="evenodd"
					/><path
						d="M14 26.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-2Z"
					/><path
						d="M16 27.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1Zm8 0a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z"
					/></g
				></svg
			>
		</div>
		<div class="dark:text-tertiary-700 text-tertiary-600">
			<p class="font-bold text-2xl">
				{data.topSalesCountry.country}
			</p>
		</div>
		<div class="flex justify-between items-center text-sm text-surface-600-300-token">
			<p class="text-tertiary-700-200-token">
				{currencyFormatter.format(data.topSalesCountry.revenue)}
			</p>
			<p>This month</p>
		</div>
	</div>
</div>
