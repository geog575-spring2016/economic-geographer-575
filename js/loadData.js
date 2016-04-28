(function() {
	d3_queue.queue()
		//always load FIPS codes...
		.defer(d3.csv, "data/FIPS.csv")
		.await(function(error, FIPS) {

			var scatterPlot = initializeScatterPlot(
				FIPS,
				{top: 90, right: 40, bottom: 75, left: 50},
				{width: 500, height: 575}
			);

			loadData(scatterPlot, "Median_Home_Value", "Median_Household_Income");
			//Schuyler, I was thinking you could call your functions here

		});

})();

function loadData(scatterPlot, xDataFilename, yDataFilename) {

	var xFilename = xDataFilename.replace(/_/g, " ");
	var yFilename = yDataFilename.replace(/_/g, " ");

	scatterPlot.xLabel.text(xFilename);
  	scatterPlot.yLabel.text(yFilename);
  	scatterPlot.titleLabel.text(yFilename+" vs. "+xFilename);

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
				bindData(scatterPlot, xData, 0, yData, 0);
				
				$('#slider').slider({
					max: Object.keys(xData[0]).length-2,
					min: 0,
					value: 0,
					change: function(event, ui) {
						var sliderVal = ui.value;
						bindData(scatterPlot, xData, sliderVal, yData, sliderVal);
					},
				});
				$('#slider').position({
					my: 'right top',
					at: 'left center',
					of: 'text.time',
				});

				setupTimeseriesAnimation();

			}

		});

}