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
		.attr("class", "innerBackground")
		.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

	var bivariates = [
		["A1", "B1", "C1"],
		["A2", "B2", "C2"],
		["A3", "B3", "C3"],
	];

	for (var i = 0; i < bivariates.length; i++) {
		for (var j = 0; j < bivariates[i].length; j++) {

			var block = inner.append("rect")
				.attr("id", bivariates[i][j])
				.attr("class", "bivariate")
				.attr("x", j*(innerWidth/3))
				.attr("y", i*(innerHeight/3))
				.attr("width", innerWidth/3)
				.attr("height", innerHeight/3);

			bivariates[i][j] = block;

		}
	}

	var xScaleQuantile = d3.scale.quantile()
        .range(bivariates[0]);

    var yScaleQuantile = d3.scale.quantile()
        .range(bivariates[0]);

	var xAxis = inner.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + innerHeight + ")");

	var yAxis = inner.append("g")
		.attr("class", "axis");

	var titleLabel = inner.append("text")
		.attr("class", "title")
		.attr("x", innerWidth/2)
		.attr("y", -margins.top)
		.attr("dy", "1.6em")
		.style("text-anchor", "middle");

	var timeLabel = inner.append("text")
		.attr("class", "time")
		.attr("x", innerWidth)
		.attr("dy", "-0.4em")
		.style("text-anchor", "end");

	var quantileLabels = [];

	var xLabel = xAxis.append("text")
		.attr("class", "label")
		.attr("x", innerWidth-6)
		.attr("y", -6)
		.style("text-anchor", "end");

	var yQuantileLabel_1 = xAxis.append("text")
		.attr("class", "numLabel")
		.attr("x", innerWidth-3)
		.attr("y", -6)
		.attr("style", "fill: white;")
		.attr("dy", "0.15em")
		.style("text-anchor", "end");

	var yQuantileLabel_2 = xAxis.append("text")
		.attr("class", "numLabel")
		.attr("x", innerWidth-3)
		.attr("y", -6)
		.attr("style", "fill: white;")
		.attr("dy", "0.15em")
		.style("text-anchor", "end");

	var yLabel = yAxis.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(90)")
		.attr("x", 6)
		.attr("y", 6)
		.attr("dy", "-0.87em") //takes place of x, since we rotated the label
		.style("text-anchor", "start");

	var xQuantileLabel_1 = yAxis.append("text")
		.attr("class", "numLabel")
		.attr("y", 14)
		.attr("style", "fill: white;")
		.style("text-anchor", "middle");

	var xQuantileLabel_2 = yAxis.append("text")
		.attr("class", "numLabel")
		.attr("y", -4)
		.style("text-anchor", "middle");

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
		xAxisGenerator: xAxisGenerator,
		yAxisGenerator: yAxisGenerator,
		background: background,
		inner: inner,
		bivariates: bivariates,
		xScaleQuantile: xScaleQuantile,
		yScaleQuantile: yScaleQuantile,
		xAxis: xAxis,
		yAxis: yAxis,
		titleLabel: titleLabel,
		timeLabel: timeLabel,
		xLabel: xLabel,
		yLabel: yLabel,
		quantileLabels: {
			x1: xQuantileLabel_1,
			x2: xQuantileLabel_2,
			y1: yQuantileLabel_1,
			y2: yQuantileLabel_2,
		},
		dots: dots,
    };

}

function bindData(plot, xData, xCol, yData, yCol, bivariate) {

	data = [];
	all_xData = [];
	all_yData = [];
	for (var i = 0; i < yData.length; i++) {

		if (xData[i]['FIPS'] != yData[i]['FIPS']) {
			console.log("FIPS order does not match between data sets");
			return;
		}

		if (bivariate) {
			var xVal = xData[i][Object.keys(xData[i])[xCol]];
		} else {
			var xVal = i;
		}

		var yVal = yData[i][Object.keys(yData[i])[yCol]];

		data.push({
			FIPS: xData[i]['FIPS'],
			x: xVal,
			y: yVal,
		});

		all_xData.push(xVal);
		all_yData.push(yVal);

	}

	data.forEach(function(d) {
	    d['x'] = +d['x'];
	    d['y'] = +d['y'];
	});

	plot.xScale.domain(d3.extent(data, function(d) { return d['x']; })).nice();
  	plot.yScale.domain(d3.extent(data, function(d) { return d['y']; })).nice();
  	
  	if (bivariate) {

  		plot.xAxisGenerator
  			.innerTickSize([6])
  			.outerTickSize([6])
  			.tickFormat(function(d) { return formatTicks(d); });

  	} else {

  		plot.xAxisGenerator
  			.innerTickSize([0])
  			.outerTickSize([0])
  			.tickFormat(function(d) { return ''; });

  	}
  	
  	plot.yAxisGenerator.tickFormat(function(d) { return formatTicks(d); });
  	plot.xAxis.call(plot.xAxisGenerator);
  	plot.yAxis.call(plot.yAxisGenerator);
  	plot.timeLabel.text(Object.keys(yData[0])[yCol]);

  	plot.xScaleQuantile.domain(all_xData);
	plot.yScaleQuantile.domain(all_yData);
	xQuantileBreaks = plot.xScaleQuantile.quantiles();
	yQuantileBreaks = plot.yScaleQuantile.quantiles();

	plot.quantileLabels.x2.transition().duration(1500)
		.attr("x", plot.xScale(xQuantileBreaks[0]))
		.text(xQuantileBreaks[0]);
	plot.quantileLabels.x1.transition().duration(1500)
		.attr("x", plot.xScale(xQuantileBreaks[1]))
		.text(xQuantileBreaks[1]);
	plot.quantileLabels.y1.transition().duration(1500)
		.attr("y", plot.yScale(yQuantileBreaks[0])-plot.yScale.range()[0])
		.text(yQuantileBreaks[0]);
	plot.quantileLabels.y2.transition().duration(1500)
		.attr("y", plot.yScale(yQuantileBreaks[1])-plot.yScale.range()[0])
		.text(yQuantileBreaks[1]);
	
	xQuantileBreaks.splice(0,0,d3.min(plot.xScale.domain()));
	xQuantileBreaks.splice(xQuantileBreaks.length,0,d3.max(plot.xScale.domain()));
	yQuantileBreaks.reverse().splice(0,0,d3.max(plot.yScale.domain()));
	yQuantileBreaks.splice(yQuantileBreaks.length,0,d3.min(plot.yScale.domain()));

  	plot.dots.data(data, function(d) {
		return d.FIPS;
	}).sort(function(a, b) {
		return a['y']-b['y'];
	})
	.transition().duration(1500)
	.attr("cx", function(d, i) {

		if (isNaN(plot.xScale(d['x']))) {
			$('.FIPS-'+d.FIPS).attr("r", 0);
		} else {
			$('.FIPS-'+d.FIPS).attr("r", 0.5);

			if (bivariate) {
				return plot.xScale(d['x']);
			} else {
				return plot.xScale(i);
			}
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

    for (var i = 0; i < plot.bivariates.length; i++) {
		for (var j = 0; j < plot.bivariates[i].length; j++) {

			plot.bivariates[i][j].transition().duration(1500)
				.attr("x", plot.xScale(xQuantileBreaks[j]))
				.attr("y", plot.yScale(yQuantileBreaks[i]))
				.attr("width", plot.xScale(xQuantileBreaks[j+1])-plot.xScale(xQuantileBreaks[j]))
				.attr("height", plot.yScale(yQuantileBreaks[i+1])-plot.yScale(yQuantileBreaks[i]));

		}
	}

}

function formatTicks(d) {

	var tickValString = d.toFixed(1);
	var tickValStrings = tickValString.split('.');

	var suffix = "";
	var magnitude = Math.ceil(tickValStrings[0].length/3);

	if (magnitude == 2) { suffix = "K"; }
	else if (magnitude == 3) { suffix = "M"; }

	return tickValStrings[0].substring(0,tickValStrings[0].length-3*(magnitude-1))+suffix;

}