//use queue.js to parallelize asynchronous data loading
d3_queue.queue()
    .defer(d3.csv, "data/test_data1.csv") //load attributes from csv
    .defer(d3.csv, "data/test_data2.csv") //load choropleth spatial data
    .await(callback);

function callback(error, csv1, csv2) {

	//BUILD SCATTER PLOT!!
	//each object in this array will correspond to a single county
	var attr = '2015-12';
	var scatterPlotData = [];

	function makeScatterData() {
		scatterPlotData = [];
		for (var i = 0; i < csv1.length; i++) {
			scatterPlotData.push({
				FIPS: csv1[i].FIPS,
				data1: csv1[i][attr],
				data2: csv2[i][attr],
			});
		}
	}

	makeScatterData();
	buildScatterPlot(scatterPlotData);

	$('#slider').slider({
		max: Object.keys(csv1[0]).length-1,
		min: 1,
		change: function(event, ui) {
			var sliderVal = $('#slider').slider("value");
			console.log(sliderVal);
			var objectKey = Object.keys(csv1[0])[sliderVal];
			attr = objectKey;
			makeScatterData();
			$('.scatterPlotBackground').remove();
			buildScatterPlot(scatterPlotData);
		},
	});
}