export default function BarChart(container) {
    // initialization
    // 1. Create a SVG with the margin convention
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
        .select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    const group = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // 2. Define scales using scaleTime() and scaleLinear()
    // Only specify ranges. Domains will be set in the 'update' function
    const xScale = d3.scaleBand().range([0, width]).paddingInner(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const xAxis = d3.axisBottom().scale(xScale);
    let xAxisGroup = group.append('g').attr('class', 'x-axis axis');

    const yAxis = d3.axisLeft().scale(yScale);
    let yAxisGroup = group.append('g').attr('class', 'y-axis axis');

    function update(data, type) {
         const regions = {};

         data.forEach((el) => {
             const cpRegion = el['company_region'];
             if (!cpRegion) return;
             const year = el['funded_year'];
             if (year === 2014) {
                 if (regions[cpRegion]) {
                     regions[cpRegion]++;
                 } else {
                     regions[cpRegion] = 1;
                 }
             }
         });
        const keys = Object.keys(regions);
        keys.sort((a, b) => regions[b] - regions[a]);

        let values = keys.map((e) => {
            return [e, regions[e]];
        });
        // top 5
        let sliced_keys = keys.slice(0, 5);
        let sliced_values = values.slice(0, 5);

        xScale.domain(sliced_keys);
        yScale.domain([0, values[0][1]]);
        // colorScale.domain(keys);

        xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(xAxis);
        yAxisGroup.call(yAxis);
        console.log('keys',sliced_keys);
        console.log('values',sliced_values);
        let bars = group
            .selectAll('rect')
            .data(sliced_values);

        bars
            .enter()
            .append('rect')
            .merge(bars)
            .attr('x', d => xScale(d[0]))
            .attr('y',d=>yScale(d[1]))
            .attr('width', d => xScale.bandwidth())
            .attr('height', d => (height-yScale(d[1])))
            .attr('fill', '#0066CC');
    }
    return {
        update,
    };
}