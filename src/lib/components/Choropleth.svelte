<script lang="ts">
	import * as d3 from 'd3';
	export let dataset: { code: string; value: number }[];

	function roundToNearest(n: number, nearest: number) {
		return Math.round(n / nearest) * nearest;
	}

	function drawChoropleth(containerEl: HTMLDivElement) {
		let svg = d3.select(containerEl).append('svg');

		const path = d3.geoPath();
		const projection = d3.geoMercator();

		let topoPromise = d3.json(
			'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
		);
		const [min, max] = d3.extent(dataset.map((d) => d.value));
		const scaleSteps = Array.from(Array(7), (d, i) => {
			return roundToNearest(((i + 1) * (max! - min!)) / 7, 5); // round to nearest 5
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

			// Legend
			const xLegend = d3.scaleLinear().domain([0, max!]).rangeRound([600, 860]);
			const legend = svg.append('g').attr('id', 'legend');
			const legend_entry = legend
				.selectAll('g.legend')
				.data(
					colorScale.range().map(function (r) {
						let d = colorScale.invertExtent(r);
						if (d[0] == null) d[0] = xLegend.domain()[0];
						if (d[1] == null) d[1] = xLegend.domain()[1];
						return d;
					})
				)
				.enter()
				.append('g')
				.attr('class', 'legend_entry');
			const ls_w = 20;
			const ls_h = 20;
			legend_entry
				.append('rect')
				.attr('x', 20)
				.attr('y', function (d, i) {
					return height - i * ls_h - 2 * ls_h;
				})
				.attr('width', ls_w)
				.attr('height', ls_h)
				.style('fill', function (d) {
					return colorScale(d[1]);
				})
				.style('opacity', 0.8);
			legend_entry
				.append('text')
				.attr('fill', 'currentColor')
				.attr('font-size', '13px')
				.attr('x', 50)
				.attr('y', function (d, i) {
					return height - i * ls_h - ls_h - 6;
				})
				.text(function (d, i) {
					if (d[0] === undefined) {
						return d[1];
					}
					if (d[1] === undefined) {
						return d[0];
					}
					return `${d[0]} - ${d[1]}`;
				});

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
					.attr('stroke', '#ddd')
					// set the color of each country
					.attr('fill', function (d) {
						d.total = dataMap.get(d.id) || 0;
						return colorScale(d.total);
					})
					.on('mouseover', mouseOver)
					.on('mouseleave', mouseLeave);
			}

			function mouseOver(e) {
				d3.selectAll('path.country')
					.transition()
					.duration(200)
					.style('opacity', 0.5)
					.style('stroke', 'transparent');
				d3.select(e.target).transition().duration(200).style('opacity', 1).style('stroke', 'black');
				const data = d3.select(e.target).data()[0];
				const tooltipText = `${data.properties.name}: ${data.total}`;
				let xPos = e.x;
				let yPos = e.y;
				tooltip
					.style('left', xPos + 'px')
					.style('top', yPos + 'px')
					.transition()
					.duration(400)
					.style('opacity', 1)
					.style('pointer-events', 'none')
					.text(tooltipText);
			}

			function mouseLeave() {
				d3.selectAll('path.country')
					.transition()
					.duration(200)
					.style('opacity', 1)
					.style('stroke', '#ddd');

				tooltip.transition().duration(300).style('opacity', 0);
			}
		}
	}
</script>

<div use:drawChoropleth class="w-full h-full" />
