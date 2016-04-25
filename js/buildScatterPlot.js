function buildScatterPlot(data) {

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 350 - margin.left - margin.right,
	    height = 350 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "scatterPlotBackground")
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
	    d.data1 = +d.data1;
	    d.data2 = +d.data2;
	});

	x.domain(d3.extent(data, function(d) { return d.data1; })).nice();
  	y.domain(d3.extent(data, function(d) { return d.data2; })).nice();

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Data1");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Data2");

	svg.selectAll(".dot")
		.data(data)
	.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2)
      .attr("cx", function(d) { return x(d.data1); })
      .attr("cy", function(d) { return y(d.data2); });

}