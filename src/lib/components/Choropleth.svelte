<script lang="ts">
	import * as d3 from 'd3';
	export let dataset: { code: string; value: number }[];

	function drawChoropleth(containerEl: HTMLDivElement) {
		let svg = d3.select(containerEl).append('svg');

		const path = d3.geoPath();
		const projection = d3.geoMercator();

		let topoPromise = d3.json(
			'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
		);
		const [min, max] = d3.extent(dataset.map((d) => d.value));
		console.log({ min, max });
		const scaleSteps = Array.from(Array(6), (d, i) => {
			return (i * (max! - min!)) / 6;
		});
		const colorScale = d3
			.scaleThreshold()
			.domain(scaleSteps)
			.range(d3.schemeBlues[7] as any);

		drawChart();
		window.addEventListener('resize', drawChart);
		async function drawChart() {
			containerEl.innerHTML = '';
			const tooltip = d3
				.select(containerEl)
				.append('div')
				.attr('class', 'bg-surface-600 text-white rounded p-2 absolute text-sm font-inherit shadow')
				.style('opacity', 0);

			const { width, height } = containerEl.getBoundingClientRect();
			projection
				.scale(Math.min(20 + 0.05 * width, 120))
				.center([0, Math.min(10 + 0.01 * width, 30)]);
			svg = d3.select(containerEl).append('svg');

			svg.attr('width', width);
			svg.attr('height', height);
			projection.translate([width / 2, height / 2]);

			const topology = await topoPromise;
			updateData(dataset, topology);

			function updateData(dataset: { code: string; value: number }[], topo: any) {
				const dataMap = new Map<string, number>();
				dataset.forEach((d) => {
					dataMap.set(d.code, d.value);
				});
				svg
					.append('g')
					.selectAll('path')
					.data(topo.features)
					.join('path')
					.attr('class', 'country')
					// draw each country
					.attr('d', path.projection(projection))
					// set the color of each country
					.attr('fill', function (d) {
						d.total = dataMap.get(d.id) || 0;
						return colorScale(d.total);
					})
					.on('mouseover', mouseOver)
					.on('mouseleave', mouseLeave);
			}

			function mouseOver(e) {
				const [x, y] = d3.pointer(e);
				d3.selectAll('path.country')
					.transition()
					.duration(200)
					.style('opacity', 0.5)
					.style('stroke', 'transparent');
				d3.select(e.target).transition().duration(200).style('opacity', 1).style('stroke', 'black');
				const data = d3.select(e.target).data()[0];
				const tooltipText = `${data.properties.name}: ${data.total}`;
				let xPos = x + 20;
				let yPos = y + 70;
				tooltip
					.style('left', xPos + 'px')
					.style('top', yPos + 'px')
					.transition()
					.duration(400)
					.style('opacity', 1)
					.text(tooltipText);
			}

			function mouseLeave() {
				d3.selectAll('path.country')
					.transition()
					.duration(200)
					.style('opacity', 1)
					.style('stroke', 'transparent');

				tooltip.transition().duration(300).style('opacity', 0);
			}
		}
	}
</script>

<div use:drawChoropleth class="w-full h-full" />
