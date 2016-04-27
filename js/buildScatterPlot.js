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

	var titleLabel = inner.append("text")
		.attr("class", "title")
		.attr("y", -margins.top/2)
		.attr("dy", "0.5em")
		.style("text-anchor", "start");

	var timeLabel = inner.append("text")
		.attr("class", "time")
		.attr("x", innerWidth)
		.attr("y", -margins.top/2)
		.attr("dy", "0.5em")
		.attr("opacity", 100)
		.style("text-anchor", "end");

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
		titleLabel: titleLabel,
		timeLabel: timeLabel,
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
  	plot.xAxisGenerator.tickFormat(function(d) { return formatTicks(d); });
  	plot.yAxisGenerator.tickFormat(function(d) { return formatTicks(d); });
  	plot.xAxis.call(plot.xAxisGenerator);
  	plot.yAxis.call(plot.yAxisGenerator);
  	plot.timeLabel.text(Object.keys(xData[0])[xCol]);

  	plot.dots.data(data, function(d) {
		return d.FIPS;
	}).transition().duration(2000)
	.attr("cx", function(d) {

		if (isNaN(plot.xScale(d['x']))) {
			$('.FIPS-'+d.FIPS).attr("r", 0);
		} else {
			$('.FIPS-'+d.FIPS).attr("r", 0.5);
			return plot.xScale(d['x']);
		}

	})
    .attr("cy", function(d) {

		if (isNaN(plot.yScale(d['y']))) {
			$('.FIPS-'+d.FIPS).attr("r", 0);
		} else {
			$('.FIPS-'+d.FIPS).attr("r", 0.5);
			return plot.yScale(d['y']);
		}

    });

}

function formatTicks(d) {

	var tickValString = d.toFixed(0);

	var suffix = "";
	var magnitude = Math.ceil(tickValString.length/3);

	if (magnitude == 2) { suffix = "K"; }
	else if (magnitude == 3) { suffix = "M"; }

	return tickValString.substring(0,tickValString.length-3*(magnitude-1))+suffix;

}