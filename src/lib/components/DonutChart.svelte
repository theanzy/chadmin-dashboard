<script lang="ts">
	import colors from 'tailwindcss/colors';
	import * as d3 from 'd3';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { unitFormatter } from '$lib/utils';
	type DataType = { label: string; value: number };
	export let dataset: DataType[];
	const margin = 40;
	function drawDonutChart(container: HTMLDivElement) {
		const { width, height } = container.getBoundingClientRect();
		const backgroundColor = $modeCurrent ? colors.neutral[200] : colors.neutral[900];
		const radius = Math.min(width, height) / 2 - margin;

		// append svg
		const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
		const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

		// colors scale
		const color = d3
			.scaleOrdinal()
			.domain(dataset.map((d) => d.label))
			.range(d3.schemeTableau10);

		// compute the position of each group on the pie
		const pie = d3
			.pie()
			.sort(null)
			.value((d) => d.value);

		const chart_data = pie(dataset);

		// the arc generator
		const arc = d3
			.arc()
			.innerRadius(radius * 0.5)
			.outerRadius(radius * 0.8);
		const valueArc = d3
			.arc()
			.innerRadius(radius * 0.4)
			.outerRadius(radius * 0.7);
		const labelArc = d3
			.arc()
			.innerRadius(radius * 0.7)
			.outerRadius(radius);

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		const slices = g
			.selectAll('allSlices')
			.data(chart_data)
			.join('path')
			.attr('d', arc)
			.attr('fill', (d) => {
				return color(d.data.label);
			})
			.attr('stroke', backgroundColor)
			.style('stroke-width', '2px')
			.style('opacity', 0.7);

		// add values
		g.selectAll('allValues')
			.data(chart_data)
			.enter()
			.append('text')
			.attr('font-size', 12)
			.attr('fill', 'currentColor')
			.text((d) => {
				return unitFormatter.format(d.data.value);
			})
			.attr('transform', (d) => {
				const pos = valueArc.centroid(d);
				return 'translate(' + pos + ')';
			})
			.style('text-anchor', (d) => {
				const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				return midangle < Math.PI ? 'start' : 'end';
			});
		// add labels
		g.selectAll('allValues')
			.data(chart_data)
			.enter()
			.append('text')
			.attr('font-size', 14)
			.attr('font-weight', 'bold')
			.attr('fill', 'currentColor')
			.text((d) => {
				return d.data.label;
			})
			.attr('transform', (d) => {
				const pos = labelArc.centroid(d);
				return 'translate(' + pos + ')';
			})
			.style('text-anchor', (d) => {
				const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
				return midangle < Math.PI ? 'start' : 'end';
			});
	}
</script>

<div use:drawDonutChart class="h-full" />
