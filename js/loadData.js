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

			//default datasets
			loadData(scatterPlot, "Median_Home_Value", "Median_Household_Income");

			setupDataDropdowns(scatterPlot);

		});

})();
function loadData(scatterPlot, xDataOption, yDataOption) {
    console.log(xDataOption)
    if (xDataOption == "Uploaded_User_Dataset") {
        loadYDataFromSite(scatterPlot, yDataOption)
    } else {
        loadDataFromSite(scatterPlot, xDataOption, yDataOption)
    }
};
function loadYDataFromSite(scatterPlot, yDataFilename) {
   var yFilename = yDataFilename.replace(/_/g, " ");
	     var uploadedFile = document.getElementById("Uploaded_User_Dataset").files[0];
    //handleFile adapted from MounirMesselmeni on github
    function handleFile(file) {
        console.log(file)
           // Check for the various File API support.
        if (window.FileReader) {
            // FileReader are supported.
						var reader = new FileReader();
					reader.onload = loadHandler;
					reader.onerror = errorHandler;
					reader.readAsText(file)
        } else {
            alert('FileReader is not supported in this browser, so your uploaded user dataset cannot be read.');
        }
    }

    function loadHandler(event) {
        var raw = event.target.result;
				console.log(raw)
				xData = d3.csv.parse(raw)
        console.log(xData)
			d3_queue.queue()
						.defer(d3.csv, "data/" + yDataFilename + ".csv")
						.await(function(error, yData) {
								applyData(scatterPlot, "Uploaded User Dataset", yFilename, xData, yData)
						})
    }

    function errorHandler(evt) {
        if (evt.target.error.name == "NotReadableError") {
           alert("Cannot read file!");
        }
    }
   handleFile(uploadedFile)
}

function loadDataFromSite(scatterPlot, xDataFilename, yDataFilename) {
    var xFilename = xDataFilename.replace(/_/g, " ");
    var yFilename = yDataFilename.replace(/_/g, " ");
   d3_queue.queue()
       .defer(d3.csv, "data/" + xDataFilename + ".csv")
			         .defer(d3.csv, "data/" + yDataFilename + ".csv")
        .await(function(error, xData, yData) {
           applyData(scatterPlot, xFilename, yFilename, xData, yData)
        })
};

function applyData(scatterPlot, xTitle, yTitle, xData, yData) {
    console.log(xData)
    console.log(yData)
    if (xData.length != yData.length) {
        //console.log("Datasets have different numbers of records,");
        console.log("ERROR: Datasets must have the same number of records!");
    } else if (Object.keys(xData[0]).length != Object.keys(yData[0]).length) {

        //console.log("Dataset features have different number of attributes,");
        console.log("Moving forward without timeseries...");

        bindData(scatterPlot, xData, 0, yData, 0, false);
        scatterPlot.xLabel.text("");
        scatterPlot.yLabel.text(yTitle);
        scatterPlot.titleLabel.text(yTitle);

				$('#slider').slider({
					animate: 1500,
					max: Object.keys(yData[0]).length-2,
					min: 0,
					value: 0,
					change: function(event, ui) {
						var sliderVal = ui.value;
						bindData(scatterPlot, xData, 0, yData, sliderVal);
					},
				});
				$('#slider').position({
					my: 'left center',
					at: 'left+50 center-100',
					of: window,
				});

				setupTimeseriesAnimation();

			} else {

				//console.log("Moving forward with timeseries...");

				scatterPlot.xLabel.text(xTitle);
       scatterPlot.yLabel.text(yTitle);
      scatterPlot.titleLabel.text(yTitle + " vs. " + xTitle);
       bindData(scatterPlot, xData, 0, yData, 0, true);

				$('#slider').slider({
					animate: 1500,
					max: Object.keys(yData[0]).length-2,
					min: 0,
					value: 0,
					change: function(event, ui) {
						var sliderVal = ui.value;
						bindData(scatterPlot, xData, sliderVal, yData, sliderVal, true);
					},
				});
				$('#slider').position({
					my: 'left center',
					at: 'left+50 center-100',
					of: window,
				});

				setupTimeseriesAnimation();

			}

		});

}
