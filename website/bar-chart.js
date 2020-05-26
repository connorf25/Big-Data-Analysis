//define svg canvas
var svg = d3.select("svg"),
margin = {
    top: 20,
    right: 10,
    bottom: 65,
    left: 110
} //position of axes frame
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom;

//next our graph
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(d) {
    d.mean = +d.mean;
    d.count = +d.count;
    return d;
}, function(error, data) {

    if (error) throw error;

    data = data;

    x1 = d3.scaleLinear().rangeRound([1, 800])
        .domain([0, d3.max(data, function(d) {
            return d.mean+20;
        })]);
    y = d3.scaleBand().rangeRound([0, height])
        .padding(0.5).domain(data.map(function(d) {
            return d.Location;
        }));

    //x axis
    x_axis = g.append("g")
        .style("font", "12px arial") 
        .attr("class", "axisx")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x1))
        .append("text")
        .attr("x", 450) 
        .attr("y", 35)
        .attr("dx", "1.0em") 
        .attr("text-anchor", "middle")
        .text("Mean Salary ($)");

    // y axis
    g.append("g")
        .style("font", "10px arial")
        .attr("class", "axisy")
        .call(d3.axisLeft(y)) 
        .append("text")
        .attr("transform", "rotate(-360)")
        .attr("y", -20) 
        .attr("dy", "1.0em") 
        .attr("text-anchor", "end")
        .text("Location");

    var bars = g.selectAll('.bar')
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("height", y.bandwidth())
        .style("fill", "#a02f2b");

    render('mean')

    function render(which) {
        x1 = d3.scaleLinear().rangeRound([1, 800])
            //experiment with the max numbers to bring the x scale within the margin
            .domain([0, d3.max(data, function(d) {
                return d[which]+10;
            })]);
        svg.selectAll("g.axisx")
            .call(d3.axisBottom(x1))
        bars
            .transition()
            .attr("y", function(d) {
                return y(d.Location);
            })
            .attr("width", function(d) {
                return x1(d[which]);
            });
    }

    d3.select("#Actual")
        .on("click", function(d, i) {
            render('mean')
        });
    d3.select("#Predicted")
        .on("click", function(d, i) {
            render('count')
        });

});