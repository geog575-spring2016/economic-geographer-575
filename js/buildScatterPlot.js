function initializeScatterPlot(dots, margins, dimensions) {

	//calculate values from object arguments
	var	innerWidth = dimensions.width - margins.left - margins.right,
		innerHeight = dimensions.height - margins.top - margins.bottom;

	var xScale = d3.scale.linear()
	    .range([0, innerWidth]);

	var yScale = d3.scale.linear()
	    .range([innerHeight, 0]);

	var xAxisGenerator = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");

	var yAxisGenerator = d3.svg.axis()
	    .scale(yScale)
	    .orient("left");

	var background = d3.select("body").append("svg")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height)
		.attr("class", "plotBackground");

	var inner = background.append("g")
		.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

	var xAxis = inner.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + innerHeight + ")");

	var yAxis = inner.append("g")
		.attr("class", "axis");

	var xLabel = xAxis.append("text")
		.attr("class", "label")
		.attr("x", innerWidth)
		.attr("y", -6)
		.style("text-anchor", "end");

	var yLabel = yAxis.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em") //takes place of x, since we rotated the label
		.style("text-anchor", "end");

	var dots = inner.selectAll(".dot")
		.data(dots).enter().append("circle")
		.attr("class", function(d) {
			return "dot FIPS-"+d.FIPS;
		})
      	.attr("r", 0.5)
      	.attr("cx", function(d) {
      		return innerWidth*Math.random();
      	})
      	.attr("cy", function(d) {
      		return innerHeight*Math.random();
      	});

    return {
		xScale: xScale,
		yScale: yScale,
		background: background,
		inner: inner,
		xAxisGenerator: xAxisGenerator,
		yAxisGenerator: yAxisGenerator,
		xAxis: xAxis,
		yAxis: yAxis,
		xLabel: xLabel,
		yLabel: yLabel,
		dots: dots,
    };

}

function bindData(plot, xData, xCol, yData, yCol) {

	data = [];
	for (var i = 0; i < xData.length; i++) {

		if (xData[i]['FIPS'] != yData[i]['FIPS']) {
			console.log("FIPS order does not match between data sets");
			return;
		}

		data.push({
			FIPS: xData[i]['FIPS'],
			x: xData[i][Object.keys(xData[i])[xCol]],
			y: yData[i][Object.keys(yData[i])[yCol]],
		});

	}

	data.forEach(function(d) {
	    d['x'] = +d['x'];
	    d['y'] = +d['y'];
	});

	plot.xScale.domain(d3.extent(data, function(d) { return d['x']; })).nice();
  	plot.yScale.domain(d3.extent(data, function(d) { return d['y']; })).nice();
  	plot.xAxis.call(plot.xAxisGenerator);
  	plot.yAxis.call(plot.yAxisGenerator);
  	plot.xLabel.text(Object.keys(xData[0])[xCol]);
  	plot.yLabel.text(Object.keys(yData[0])[yCol]);

  	plot.dots.data(data, function(d) {
		return d.FIPS;
	}).transition().delay(function(d, i) {
		return i*0.5;
	}).duration(2000)
	.attr("cx", function(d) { return plot.xScale(d['x']); })
    .attr("cy", function(d) { return plot.yScale(d['y']); });

}