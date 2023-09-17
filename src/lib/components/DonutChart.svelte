<script lang="ts">
	import * as d3 from 'd3';
	import { currencyFormatter } from '$lib/utils';
	type DataType = { label: string; value: number };
	export let dataset: DataType[] = [];
	const margin = 40;

	function drawDonutChart(
		container: HTMLDivElement,
		{
			dataset
		}: {
			dataset: DataType[];
		}
	) {
		const { width, height } = container.getBoundingClientRect();
		const radius = Math.min(width, height) / 2 - margin;

		// append svg
		const svg = d3.select(container).append('svg');
		svg.append('g').attr('class', 'slices');

		svg
			.append('g')
			.attr('class', 'labels')
			.attr('font-family', 'inherit')
			.attr('font-size', 12)
			.attr('text-anchor', 'middle');

		// colors scale
		let color = d3
			.scaleOrdinal()
			.domain(dataset.map((d) => d.label))
			.range(d3.schemeTableau10);
		// compute the position of each group on the pie
		const pieFn = d3
			.pie()
			.sort(null)
			.value((d) => d.value)
			.padAngle(0.03);

		// the arc generator
		let arc = d3
			.arc()
			.innerRadius(radius * 0.5)
			.outerRadius(radius * 0.8);

		drawChart();
		window.addEventListener('resize', drawChart);

		function drawChart() {
			const { width, height } = container.getBoundingClientRect();
			const radius = Math.min(width, height) / 2 - margin;
			// append svg
			svg.attr('width', width).attr('height', height);

			svg.select('.slices').attr('transform', `translate(${width / 2},${height / 2})`);

			svg
				.select('.labels')
				.attr('transform', `translate(${width / 2},${height / 2})`)
				.attr('font-family', 'inherit')
				.attr('font-size', 12)
				.attr('text-anchor', 'middle');

			arc.innerRadius(radius * 0.5).outerRadius(radius * 0.8);

			updateData(dataset);
		}

		function updateData(dataset: DataType[]) {
			/* ------- PIE SLICES -------*/
			const chart_data = pieFn(dataset);
			color.domain(dataset.map((d) => d.label));
			svg
				.select('.slices')
				.selectAll('path.slice')
				.data(chart_data)
				.join('path')
				.attr('class', 'slice')
				.attr('d', arc)
				.attr('fill', (d) => {
					return color(d.data.label);
				})
				.style('opacity', 0.7)
				.append('title')
				.text((d) => `${d.data.label}: ${currencyFormatter.format(d.data.value)}`);
			svg.select('.labels').selectAll('.label-text').remove();
			svg
				.select('.labels')
				.selectAll()
				.data(chart_data)
				.join('text')
				.attr('class', 'label-text')
				.attr('transform', (d) => `translate(${arc.centroid(d)})`)
				.call((text) =>
					text
						.append('tspan')
						.attr('y', '-0.4em')
						.attr('fill', 'currentColor')
						.attr('font-weight', 'bold')
						.text((d) => d.data.label)
						.filter((d) => d.endAngle - d.startAngle > 0.25)
						.append('tspan')
						.attr('x', 0)
						.attr('y', '0.7em')
						.attr('fill', 'currentColor')
						.attr('fill-opacity', 0.7)
						.text((d) => currencyFormatter.format(d.data.value))
				);
		}
		return {
			update({ dataset }: { dataset: DataType[] }) {
				updateData(dataset);
			},
			destroy() {
				window.removeEventListener('resize', drawChart);
			}
		};
	}
</script>

<div use:drawDonutChart={{ dataset: dataset }} class="h-full" />
