<script lang="ts">
	import * as d3 from 'd3';
	export let dataset: { code: string; value: number }[];

	function drawChoropleth(containerEl: HTMLDivElement) {
		let svg = d3.select(containerEl).append('svg');

		const path = d3.geoPath();
		const projection = d3.geoMercator().scale(100).center([0, 40]);

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

			const { width, height } = containerEl.getBoundingClientRect();

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
					// draw each country
					.attr('d', path.projection(projection))
					// set the color of each country
					.attr('fill', function (d) {
						d.total = dataMap.get(d.id) || 0;
						return colorScale(d.total);
					});
			}
		}
	}
</script>

<div use:drawChoropleth class="w-full h-full" />
