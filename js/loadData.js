(function() {
	d3_queue.queue()
		//always load FIPS codes...
		.defer(d3.csv, "data/FIPS.csv")
		.await(function(error, FIPS) {

			var scatterPlot = initializeScatterPlot(
				FIPS,
				{top: 20, right: 40, bottom: 30, left: 40},
				{width: 650, height: 650}
			);

			loadData(scatterPlot, "Median_Home_Value", "test_data3");
			//Schuyler, I was thinking you could call your functions here

		});

})();

function loadData(scatterPlot, xDataFilename, yDataFilename) {

	d3_queue.queue()
		.defer(d3.csv, "data/"+xDataFilename+".csv")
		.defer(d3.csv, "data/"+yDataFilename+".csv")
		.await(function(error, xData, yData) {

			if (xData.length != yData.length) {
				console.log("Datasets have different numbers of records,");
				console.log("ERROR: Datasets must have the same number of records!");
			} else if (Object.keys(xData[0]).length != Object.keys(yData[0]).length) {
				console.log("Dataset features have different number of attributes,");
				console.log("Moving forward without timeseries...");
			} else {
				console.log("Moving forward with timeseries...");
				bindData(scatterPlot, xData, 1, yData, 1);
				$('#slider').slider({
					max: Object.keys(xData[0]).length-1,
					min: 1,
					change: function(event, ui) {
						var sliderVal = $('#slider').slider("value");
						bindData(scatterPlot, xData, sliderVal, yData, sliderVal);
					},
				});
			}

		});

}