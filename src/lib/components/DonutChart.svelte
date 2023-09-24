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
			const data0 = svg.select('.slices').selectAll('path.slice').data();
			const data1 = chart_data;
			color.domain(dataset.map((d) => d.label));
			svg
				.select('.slices')
				.selectAll('path.slice')
				.data(data1, key)
				.join(
					function enter(enter) {
						return enter
							.append('path')
							.attr('class', 'slice')
							.attr('fill', function (d) {
								return color(key(d));
							})
							.each(function (d, i) {
								this._current = findNeighborArc(i, data0, data1, key) || d;
							})
							.transition()
							.duration(300)
							.attr('opacity', 0);
					},
					function update(update) {
						return update;
					},
					function exit(exit) {
						return exit
							.datum((d, i) => findNeighborArc(i, data1, data0, key) || d)
							.transition()
							.duration(300)
							.attrTween('d', arcTween)
							.remove();
					}
				)
				.join('path')
				.transition()
				.duration(300)
				.tween('d', arcTween)
				.attr('class', 'slice')
				.attr('d', arc)
				.style('opacity', 0.7);
			// .append('title')
			// .text((d) => `${key(d)}: ${currencyFormatter.format(d.data.value)}`);

			svg.select('.labels').selectAll('.label-text').remove();
			svg
				.select('.labels')
				.selectAll()
				.data(chart_data, key)
				.join('text')
				.attr('class', 'label-text')
				.attr('transform', (d) => `translate(${arc.centroid(d)})`)
				.call((text) =>
					text
						.append('tspan')
						.attr('y', '-0.4em')
						.attr('fill', 'currentColor')
						.attr('font-weight', 'bold')
						.text(key)
						.filter((d) => d.endAngle - d.startAngle > 0.25)
						.append('tspan')
						.attr('x', 0)
						.attr('y', '0.7em')
						.attr('fill', 'currentColor')
						.attr('fill-opacity', 0.7)
						.text((d) => currencyFormatter.format(d.data.value))
				);
		}
		function findNeighborArc(i: number, data0: any, data1: any, key: (d: any) => string) {
			var d;
			return (d = findPreceding(i, data0, data1, key))
				? { startAngle: d.endAngle, endAngle: d.endAngle }
				: (d = findFollowing(i, data0, data1, key))
				? { startAngle: d.startAngle, endAngle: d.startAngle }
				: null;
		}

		function findPreceding(i: number, data0: any, data1: any, key: (d: any) => string) {
			const m = data0.length;
			while (--i >= 0) {
				const k = key(data1[i]);
				for (var j = 0; j < m; ++j) {
					if (key(data0[j]) === k) return data0[j];
				}
			}
		}

		function findFollowing(i: number, data0: any, data1: any, key: (d: any) => string) {
			const n = data1.length;
			const m = data0.length;
			while (++i < n) {
				var k = key(data1[i]);
				for (var j = 0; j < m; ++j) {
					if (key(data0[j]) === k) return data0[j];
				}
			}
		}
		function arcTween(d, index) {
			this._current = this._current || d;
			const interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function (t) {
				return arc(interpolate(t), index);
			};
		}

		function key(d: { data: { label: string } }) {
			return d.data.label;
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
