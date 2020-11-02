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

    function slider(data){

        let minYear = d3.min(data, (d) => d.funded_year);
        let maxYear = d3.max(data, (d) => d.funded_year);
        


        var slider = d3
            .sliderHorizontal()
            .min(minYear)
            .max(maxYear)
            .tickFormat(d3.timeFormat("%Y"))
            .step(1)
            .width(300)
            .displayValue(false)
            .on('onchange', function(val) {
                d3.select('#value').text(val);
                //console.log(yearSelect);
            });
        d3.select('#slider')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)')
            .call(slider);
    }

    function update(data, type) {        

        const select = {};
        let column;
        if (type==='country'){
            column='company_country_code';
        }
        else if (type==='market'){
            column='company_market';
        }
        else {
            column='company_region';
        }
        const tenYearsBefore={};
         data.forEach((el) => {
             const count = el[column];
             if (!count) return;
             const year = el['funded_year'];
             if (year === 2014) {
                 if (select[count]) {
                     select[count]++;
                 } else {
                     select[count] = 1;
                 }
             }
             if (year === 2014-10) {
                if (tenYearsBefore[count]) {
                    tenYearsBefore[count]++;
                } else {
                    tenYearsBefore[count] = 1;
                }
            }
         });


        const keys = Object.keys(select);
        keys.sort((a, b) => select[b] - select[a]);

        const keysPast = Object.keys(tenYearsBefore);

        let values = keys.map((e) => {
            return [e, select[e]];
        });
        
        // top 10
        let sliced_keys = keys.slice(0, 10);
        let sliced_values = values.slice(0, 10);

        let sliced_values_past = sliced_keys.map((e)=>{
            return [e,tenYearsBefore[e]];
        })


        var percent_change=[];
        for (var i=0; i<10;i++){
            let dif = sliced_values[i][1]-sliced_values_past[i][1];
            let percent = dif/sliced_values_past[i][1]*100;    
            percent_change.push(percent);       
        }

        //key:value
        var percentChange = new Map(); 
      
        for(var i = 0; i < sliced_keys.length; i++){ 
            percentChange.set(sliced_keys[i], percent_change[i]); 
        }
        console.log(percentChange);


        
console.log(percent_change);
            
        
        xScale.domain(sliced_keys);
        yScale.domain([0, values[0][1]]);
        // colorScale.domain(keys);

        xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(xAxis);
        yAxisGroup.call(yAxis);
        //console.log('keys',sliced_values_past);
        
        let bar = group
            .selectAll('rect')
            .data(sliced_values);

        bar
            .enter()
            .append('rect')
            .merge(bar)
            .transition()
            .style('opactiy', 0.5)
            .transition()
            .duration(500)
            .attr('x', d => xScale(d[0]))
            .attr('y',d=>yScale(d[1]))
            .attr('width', d => xScale.bandwidth())
            .attr('height', d => (height-yScale(d[1])))
            .attr('fill', '#0066CC')
            .on("mouseover", (event,d) =>{
                const pos = d3.pointer(event, window);
                d3.select('.tooltip')
                    .style("left", pos[0] + "px")
                    .style("top", pos[1] + "px")
                    .classed("hidden", false);
                    /*document.getElementById('type').innerHTML =type; 
                    document.getElementById('name').innerHTML =d.LifeExpectancy;      
                    document.getElementById('current').innerHTML =d.Income;  
                    document.getElementById('past').innerHTML =d.Population;  
                    document.getElementById('change').innerHTML =d.Region; */
             })
            .on("mouseout", (event, d) => {
                d3.select(".tooltip").classed("hidden", true);
            });

            bar.exit().remove();
    }
    return {
        update,
        slider,
    };
}