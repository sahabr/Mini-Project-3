export default function BarChart(container){

    var margin = {top: 10, right: 10, bottom: 100, left: 60},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    const svg = d3
        .select(".chart-container1")
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.top+')');

    // Initialize axes
    let xScale = d3
        .scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);
    
    let yScale = d3
        .scaleLinear()
        .rangeRound([height,0]);
      
    let xAxis = d3.axisBottom();
    let yAxis = d3.axisLeft();

    // Initialize SVG axes groups
    svg
        .append('g')
        .attr('class', 'x-axis')
        .attr("transform", "translate(" + 0 + ", " + height + ")");
    
    svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + 0 + ", 0 )");
    
    let xLabel = d3
        .select('g')
        .append('text')
        .attr('x',width-55)
        .attr('y',height+30)
        .attr('class', 'x-axis-title')
        .style("font","14px times")
        .style("font-family","sans-serif");
    
    let yLabel = d3
        .select('g')
        .append('text')
        .attr('x',-105)
        .attr('y',-50)
        .attr('class', 'y-axis-title')
        .attr("transform", "rotate(-90)")
        .style("font","14px times")
        .style("font-family","sans-serif");
 


    // Update function    
    function updateVis(data,type) {

        // Get the selected group-by option
        //let type = document.querySelector("#group-by").value;
console.log(type);
        var ydata;




        //something like this for the frequency of each category
        //var count=[];
        function counts(d) {
            if (!count[d]) {
                count[d] = 0;
            }
            count[d]++;
        }   
    
        // Update scale domains
        if (type==='regions') {
            let regionMin = d3.min(data, d => counts(d.region));
            let regionMax = d3.max(data, d => counts(d.region));
            yScale = d3  
                .scaleLinear()
                .domain([0,regionMax])
                .range([height, 0]);
            xScale.domain(data.map(d => d.region));
        }
        else if (type==='categories') {
            let catMin = d3.min(data, d => counts(d.company_market));
            let catMax = d3.max(data, d => counts(d.company_market));
            yScale = d3  
                .scaleLinear()
                .domain([0,catMax])
                .range([height, 0]);
            xScale.domain(data.map(d => d.market));
            console.log(yScale);
        }
        else if (type=='investors'){
            let investMin = d3.min(data, d => counts(d.investor_name));
            let investMax = d3.max(data, d => counts(d.investor_name));
            yScale = d3  
                .scaleLinear()
                .domain([0,investMax])
                .range([height, 0]);
            xScale.domain(data.map(d => d.investor_name));
        }
        else if (type=='countries'){
            let countryMin = d3.min(data, d => counts(d.country));
            let countryMax = d3.max(data, d => counts(d.country));
            yScale = d3  
                .scaleLinear()
                .domain([0,countryMax])
                .range([height, 0]);
            xScale.domain(data.map(d => d.country));
        }
        
        // NOT SURE - Data join
        const bar = svg.selectAll('.bars')
        .data(data);
        
        // Enter
        bar
        .enter()
        .append('rect')
        .attr('class','bars')
        //Update
        .merge(bar)
        .transition()
        .delay(200)
        .style("opactiy", 0.5)
        .transition()
        .duration(1000)
        .style("opacity", 1.0)
        .attr('width', xScale.bandwidth())
        .attr('height', function(d){
            return height;                //
        })
        .attr('x',d=>xScale(d.market))                     //
        .attr('y',d=> yScale(d.market))                    //
        .attr('fill','#865F3A')
       
        // Exit
        bar.exit().remove();
        svg.exit().remove();

        // Drawr Axes
        drawAxes(type);

    }

    //Axes function
    function drawAxes(type) {

        xAxis.scale(xScale);
        yAxis.scale(yScale);
    
        svg
            .select('.x-axis')
            .transition()
            .duration(600)
            .call(xAxis);
        
        svg
            .select('.y-axis')
            .transition()
            .duration(300)
            .style("opacity", 0)
            .transition()
            .duration(300)
            .style("opacity", 1)
            .call(yAxis);
        
        svg
            .select('.x-axis-title')
            .text('Company');

        svg
            .select('.y-axis-title')
            .text(function(d){
                return 'year';
            });
            
    }

    return {
        drawAxes,
        updateVis,
    };

    
}


/*export default function BarChart(container){

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

        //something like this for the frequency of each category
        var counts = {};
        ydata.forEach(function(d) {         //ydata but not quite sure how to access the data
        if (!counts[d]) {
            counts[d] = 0;
        }
        counts[d]++;
        });

        var data1 = d3.entries(counts); //returns key:value i think this would be the x and y

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
    

}*/