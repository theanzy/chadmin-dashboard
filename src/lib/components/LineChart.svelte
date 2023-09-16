<script lang="ts">
	import * as d3 from 'd3';
	type SeriesDataType = { x: Date; y: number };
	type Margin = {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};

	type TooltipValueGetter = (d: SeriesDataType) => { x: string; y: string };

	export let dataset: Array<SeriesDataType> = [];
	export let tooltipValueGetter: TooltipValueGetter;

	const bisect = d3.bisector((d: any) => d.x).left;

	function drawLineChart(
		vizContainer: HTMLDivElement,

		{
			margin,
			tooltipValueGetter,
			dataset
		}: {
			dataset: Array<SeriesDataType>;
			margin: Margin;
			tooltipValueGetter?: TooltipValueGetter;
		}
	) {
		// Define the x and y domains
		const xScale = d3.scaleTime().domain(d3.extent(dataset, (d) => d.x));
		const yMax = d3.max(dataset, (d) => d.y) ?? 0;
		const yScale = d3.scaleLinear().domain([0, yMax]);

		// Create the line generator
		const lineFn = d3
			.line()
			.x((d) => xScale(d.x))
			.y((d) => yScale(d.y));

		let line: d3.Selection<SVGPathElement, unknown, null, undefined>;
		let xAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
		let yAxis: d3.Selection<SVGGElement, unknown, null, undefined>;
		let circle: d3.Selection<SVGCircleElement, unknown, null, undefined>;
		let listeningRect: d3.Selection<SVGRectElement, unknown, null, undefined>;
		let tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;

		redraw();
		window.addEventListener('resize', redraw);

		function redraw(): void {
			if (!vizContainer) {
				return;
			}
			vizContainer.innerHTML = '';
			const { width: containerWidth, height: containerHeight } =
				vizContainer.getBoundingClientRect();
			const width = containerWidth - margin.left - margin.right;
			const height = containerHeight - margin.top - margin.bottom;

			// create tooltip div

			tooltip = d3
				.select(vizContainer)
				.append('div')
				.attr('class', 'linechart_tooltip')
				.style('display', 'none');

			// Set up the x and y scales
			xScale.range([0, width]);
			yScale.range([height, 0]);
			// Create the SVG element and append it to the chart container
			const svg = d3
				.select(vizContainer)
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom);
			const vizGraph = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

			// Add the x-axis
			xAxis = vizGraph
				.append('g')
				.attr('transform', `translate(0,${height})`)
				.call(d3.axisBottom(xScale));

			// Add the y-axis
			yAxis = vizGraph.append('g').call(d3.axisLeft(yScale).tickFormat(d3.format('~s')));

			// Add the line path to the SVG element
			line = vizGraph
				.append('path')
				.datum(dataset)
				.attr('fill', 'none')
				.attr('stroke', '#7700ee')
				.attr('stroke-width', 1)
				.attr('d', lineFn);

			// Add a circle element
			circle = vizGraph
				.append('circle')
				.attr('r', 0)
				.attr('fill', '#333')
				.style('stroke', 'white')
				.attr('opacity', 0.7)
				.style('pointer-events', 'none');
			// create a listening rectangle

			listeningRect = vizGraph
				.append('rect')
				.attr('width', width)
				.attr('fill', 'transparent')
				.attr('height', height);

			// create the mouse move function
			listeningRect.on('mousemove', (e) => onMouseMove(e, dataset));
			// listening rectangle mouse leave function
			listeningRect.on('mouseleave', onMouseLeave);
		}

		function onMouseLeave() {
			circle.transition().duration(50).attr('r', 0);
			tooltip.style('display', 'none');
		}

		function onMouseMove(event: MouseEvent, dataset: Array<SeriesDataType>) {
			const [xCoord] = d3.pointer(event, this);
			const x0 = xScale.invert(xCoord);
			const i = bisect(dataset, x0, 1);
			const d0 = dataset[i - 1];
			const d1 = dataset[i];
			const dTarget = x0.getTime() - d0.x.getTime() > d1.x.getTime() - x0.getTime() ? d1 : d0;
			const xPos = xScale(dTarget.x);
			const yPos = yScale(dTarget.y);

			circle.attr('cx', xPos).attr('cy', yPos);

			// Add transition for the circle radius
			circle.transition().duration(50).attr('r', 5);

			// tooltip content
			let tooltipXDisplay = dTarget.x.toUTCString();
			let tooltipYDisplay: string | number = dTarget.y;

			if (tooltipValueGetter) {
				const dataDisplay = tooltipValueGetter(dTarget);
				tooltipXDisplay = dataDisplay.x;
				tooltipYDisplay = dataDisplay.y;
			}

			// tooltip position
			tooltip.style('display', 'block').html(`<div>
						<strong>${tooltipXDisplay}</strong>
						<p>${tooltipYDisplay}</p>
					</div>`);

			// add in  our tooltip
			const tooltipRect = tooltip.node()!.getBoundingClientRect();
			let tooltipXPos = xPos + 45;
			let tooltipYPos = yPos + 30;
			const { width: containerWidth, height: containerHeight } =
				vizContainer.getBoundingClientRect();
			const width = containerWidth - margin.left - margin.right;
			const height = containerHeight - margin.top - margin.bottom;
			if (tooltipXPos + tooltipRect.width > width) {
				tooltipXPos -= tooltipRect.width + 5;
			}
			if (tooltipYPos + tooltipRect.height > height) {
				tooltipYPos -= tooltipRect.height + 15;
			}

			tooltip.style('left', `${tooltipXPos}px`).style('top', `${tooltipYPos}px`);
		}
		function updateChart(dataset: SeriesDataType[]) {
			// new scale
			xScale.domain(d3.extent(dataset, (d) => d.x));
			const yMax = d3.max(dataset, (d) => d.y) ?? 0;
			yScale.domain([0, yMax]);

			// transform the elements
			xAxis.call(d3.axisBottom(xScale));
			yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format('~s')));
			listeningRect.on('mousemove', (e) => onMouseMove(e, dataset));
			listeningRect.on('mouseleave', onMouseLeave);
			line
				.datum(dataset)
				.transition()
				.duration(1000)
				.attr('fill', 'none')
				.attr('stroke', '#7700ee')
				.attr('stroke-width', 1)
				.attr('d', lineFn);
		}
		return {
			update({ dataset }: { dataset: SeriesDataType[] }) {
				updateChart(dataset);
			},
			destroy() {
				window.removeEventListener('resize', redraw);
			}
		};
	}
</script>

<div
	use:drawLineChart={{
		dataset: dataset,
		margin: {
			top: 20,
			right: 50,
			bottom: 30,
			left: 40
		},
		tooltipValueGetter: (d) => {
			const v = tooltipValueGetter(d);
			return {
				x: v.x,
				y: v.y
			};
		}
	}}
	class="w-full h-full relative cursor-pointer"
/>

<style lang="postcss">
	:global(.linechart_tooltip) {
		position: absolute;
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		color: theme(colors.surface.200);
		background-color: theme(colors.surface.500);
		font-size: theme(fontSize.xs);
		font-family: inherit;
	}
</style>
