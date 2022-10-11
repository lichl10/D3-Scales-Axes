//tooltip not showing up 
//ledgend not done
//need figure out circle radius
d3.csv("./wealth-health-2014.csv", d3.autoType).then(data=>{
    console.log('cities',data);
    let margin = {top:25, right:25, bottom:25, left:25};
    let width = 650 - margin.left - margin.right;
    let height = 500 - margin.top - margin.bottom;

    let svg = d3.select('.chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    let incomeMin = d3.min(data, d => d.Income),
        incomeMax = d3.max(data, d => d.Income);

    let xScale = d3.scaleLinear()
        .domain([incomeMin,incomeMax])
        .range([0,width]);

    let lifeExpectancyMin = d3.min(data, d => d.LifeExpectancy),
        lifeExpectancyMax = d3.max(data, d => d.LifeExpectancy);

    let yScale = d3.scaleLinear()
        .domain([lifeExpectancyMin,lifeExpectancyMax])
        .range([height,0]);

    console.log(xScale(incomeMax)); // returns the chart width
    console.log(yScale(lifeExpectancyMax)); // returns the chart height

    let xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,"s");
    
    let yAxis = d3.axisLeft()
        .scale(yScale);

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
    
    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    svg.append("text")
		.attr('x', width-60)
		.attr('y', height-5)
        .attr('class','axisT')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'baseline')
		.text("Income");

    svg.append("text")
		.attr('x', 85)
		.attr('y', -5)
        .attr('class','axisT')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'baseline')
		.text("Life Expectancy")
        .attr("transform", `rotate(${90})`);

    let colorScale = d3.scaleOrdinal()
        .domain(d3.extent(data, d=>d.Region))
        .range(d3.schemeTableau10);

    let aScale = d3.scaleSqrt()
        .domain([0, d3.max(data, function(d) {return d.Population;})])
        .range([4,16]);
        
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr('fill', d => colorScale(d.Region))
        .attr('stroke','#757575')
        .attr('opacity', 0.7)
        .attr('r', d=>aScale(d.Population))
        .on("mouseenter", (event, d) => {
            // show the tooltip
            let pos = d3.pointer(event, window); // pos = [x,y]
            
            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", pos[0] + "px")
                .style("top", pos[1] + "px")
                .select("#value")
                .html("Country: "+d.Country+'<br>'
                     +"Region: "+d.Region+'<br>'
                     +"Population: "+d3.format(",")(d.Population)+'<br>'
                     +"Income: "+d3.format(",")(d.Income)+'<br>'
                     +"Life Expectancy: "+d.LifeExpectancy);
               

            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseleave", (event, d) => {
            // hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });
    
        let regions = colorScale.domain();
        let legend = svg.append("g");
        legend.selectAll("rect")
            .data(regions)
            .enter()
            .append("rect")
            .attr("x",420)
            .attr("y",function(regions,i){
                return i*25+290
            })
            .attr("width",15)
            .attr("height",15)
            .attr("fill", regions=>colorScale(regions))
            .attr("opacity",0.7);
        legend.selectAll("text")
            .data(regions)
            .enter()
            .append("text")
            .attr("x",450)
            .attr("y", function(regions,i){
                return i*25+303
            })
            .text((datum)=>datum);
})