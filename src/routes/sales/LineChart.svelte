<script lang="ts">
	import * as d3 from 'd3';
	type DataType = { x: string; y: number };
	export let dataset: Array<DataType> = [];
	type Margin = {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};

	type TooltipValueGetter = (d: DataType) => { x: string; y: string };

	function drawLineChart(
		vizContainer: HTMLDivElement,

		{
			margin,
			tooltipValueGetter
		}: {
			margin: Margin;
			tooltipValueGetter?: TooltipValueGetter;
		}
	) {
		// Define the x and y domains
		const xScale = d3.scalePoint().domain(dataset.map((d) => d.x));
		const yMax = d3.max(dataset, (d) => d.y) ?? 0;
		const yScale = d3.scaleLinear().domain([0, yMax]);

		// Create the line generator
		const line = d3
			.line<{ x: string; y: number }>()
			.x((d) => xScale(d.x))
			.y((d) => yScale(d.y));

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

			const tooltip = d3.select(vizContainer).append('div').attr('class', 'linechart_tooltip');

			// Set up the x and y scales
			xScale.range([0, width]);
			yScale.range([height, 0]);
			// Create the SVG element and append it to the chart container
			const svg = d3
				.select(vizContainer)
				.append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);

			// Add the x-axis
			svg
				.append('g')
				.attr('transform', `translate(0,${height})`)
				.call(d3.axisBottom(xScale).ticks(dataset.length));

			// Add the y-axis
			svg.append('g').call(d3.axisLeft(yScale));

			// Add the line path to the SVG element
			svg
				.append('path')
				.datum(dataset)
				.attr('fill', 'none')
				.attr('stroke', '#7700ee')
				.attr('stroke-width', 1)
				.attr('d', line);

			// Add a circle element
			const circle = svg
				.append('circle')
				.attr('r', 0)
				.attr('fill', '#333')
				.style('stroke', 'white')
				.attr('opacity', 0.7)
				.style('pointer-events', 'none');
			// create a listening rectangle

			const listeningRect = svg
				.append('rect')
				.attr('width', width)
				.attr('fill', 'transparent')
				.attr('height', height);

			// create the mouse move function
			listeningRect.on('mousemove', function (event) {
				const [xCoord] = d3.pointer(event, this);
				const xStep = xScale.step();
				const i = Math.floor(xCoord / xStep);
				const distanceLeft = xCoord - i * xStep;
				const distanceRight = (i + 1) * xStep - xCoord;
				const isTooFar = distanceLeft > xStep * 0.05 && distanceRight > xStep * 0.05;
				if (isTooFar) {
					circle.transition().duration(50).attr('r', 0);
					tooltip.style('display', 'none');
					tooltip.style('left', `0`).style('top', `0`);
					return;
				}
				const iTarget = distanceLeft < distanceRight ? i : i + 1;
				const d = dataset[iTarget];
				// Update the circle position
				const xPos = xScale(d.x) || 0;
				const yPos = yScale(d.y);
				console.log({ iTarget, d, xPos, yPos });

				circle.attr('cx', xPos).attr('cy', yPos);

				// Add transition for the circle radius
				circle.transition().duration(50).attr('r', 5);

				// add in  our tooltip
				let tooltipXPos = xPos + 50;
				if (tooltipXPos > width * 0.95) {
					tooltipXPos -= 100;
				}

				let tooltipYPos = yPos + 30;
				if (tooltipYPos > height * 0.95) {
					tooltipYPos -= 70;
				}
				let tooltipXDisplay = d.x;
				let tooltipYDisplay: string | number = d.y;
				if (tooltipValueGetter) {
					const dataDisplay = tooltipValueGetter(d);
					tooltipXDisplay = dataDisplay.x;
					tooltipYDisplay = dataDisplay.y;
				}
				tooltip
					.style('left', `${tooltipXPos}px`)
					.style('top', `${tooltipYPos}px`)
					.style('display', 'block').html(`<div>
						<strong>${tooltipXDisplay}</strong>
						<p>${tooltipYDisplay}</p>
					</div>`);

				// listening rectangle mouse leave function
				listeningRect.on('mouseleave', function () {
					circle.transition().duration(50).attr('r', 0);
					tooltip.style('display', 'none');
				});
			});
		}
		return {
			destroy() {
				window.removeEventListener('resize', redraw);
			}
		};
	}
</script>

<div
	use:drawLineChart={{
		margin: {
			top: 20,
			right: 50,
			bottom: 30,
			left: 50
		},
		tooltipValueGetter: (d) => {
			return {
				x: d.x,
				y: `$ ${d.y}.00`
			};
		}
	}}
	class="w-full h-full relative"
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
