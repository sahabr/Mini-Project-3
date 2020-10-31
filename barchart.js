export default function BarChart(container){

    var margin = {top: 10, right: 10, bottom: 100, left: 60},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
    
    const xScale = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
    
    const yScale = d3.scaleLinear()
        .rangeRound([height,0])


    svg.append('g')
        .attr('class', 'x-axis')
        .attr("transform", `translate(0, ${height})`)
    
    
    svg.append('g')
        .attr('class', 'y-axis')
    
    svg.append('text')
        .attr('x',width-55)
        .attr('y',height+30)
        .attr('class', 'x-axis-title');
    
    svg.append('text')
        .attr('x',-105)
        .attr('y',-50)
        .attr('class', 'y-axis-title')
        .attr("transform", "rotate(-90)");


 

    function update(data,type){
        var ydata;
        if (type==='regions'){
            ydata=d[0].region;
        }
        else if (type==='categories'){
            ydata=d[0][" market "];
        }
        else if (type==investors){
            ydata= d[3].investor_name;
        }
        else if (type==countries){
            ydata=d[0].country;
        }

        //Sort count to display top 20?

        xScale.domain(data.map(d=>d[0].name))               //
        yScale.domain([0,d3.max(data,d=>d[0][type])])        //should be count right?


        const bar = svg.selectAll('.bars')
        .data(data);

    bar.enter()
        .append('rect')
        .attr('class','bars')
        .attr("opacity", 0)
        .merge(bar)
        .transition()
        .delay(200)
        .duration(1000)
        .attr('width', xScale.bandwidth())
        .attr('height', function(d){
            return height-yScale(d[0].year);                //
        })
        .attr('x',d=>xScale(d[0].name))                     //
        .attr('y',d=> yScale(d[0][type]))                    //
        .attr('fill','#865F3A')
        .attr("opacity", 1.0);

        bar.exit().remove();

    

    const xAxis = d3.axisBottom()
        .scale(xScale);

    const yAxis = d3.axisLeft()
        .scale(yScale);
    
    svg.select('.x-axis')
        .call(xAxis);
    
    svg.select('.y-axis')
        .call(yAxis);
    
    svg.select('.x-axis-title')
        .text('Company');

    svg.select('.y-axis-title')
        .text(function(d){
            return 'year';
        });
    }

    return {
        update // ES6 shorthand for "update": update
	};
    

}