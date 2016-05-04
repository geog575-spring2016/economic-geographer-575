var mouseMoveControl = true;

var filterHolder;
var xQuantile01;
var xQuantile02;
var yQuantile01;
var yQuantile02;

//variables for displaying pop-up info
var displayPop01 = 0;
var displayPop02 = 0;
var displayPop10 = 0;
var displayPop20 = 0;

//variable for keeping track of year
var displayedYear = 2009;

var arrAxisValues = [ //I don't think this needs anything from uploaded data
	"Median_Home_Value",
	"Median_Household_Income",
	"Median_Monthly_Ownership_Costs",
	"Unemployment_Rate",
	"Uploaded_User_Dataset"
];

var yAxisValue = arrAxisValues[1];
var xAxisValue = arrAxisValues[0];

var arrMedianHomeValue = [
	"medianHome",
	"medianHo_1",
	"medianHo_2",
	"medianHo_3",
	"medianHo_4",
	"medianHo_5"
];

var arrIncome = [
	/*"Income_Dat",*/
	"Income_200",
	"Income_201",
	"Income_202",
	"Income_203",
	"Income_204",
	"Income_205"
];

var arrMonthlyCost = [
	/*"MonthyCost",*/
	"MonthlyCos",
	"MonthlyC_1",
	"MonthlyC_2",
	"MonthlyC_3",
	"MonthlyC_4",
	"MonthlyC_5"
];

var arrUnemployment = [
	"Unemployme",
	"Unemploy_1",
	"Unemploy_2",
	"Unemploy_3",
	"Unemploy_4",
	"Unemploy_5"
];
var arrUploadedData = [ //I need to convert this to an array of the uploaded data, or link or something.
	//at this point it looks to me that it just needs an array from uploaded data, not uploaded data to be in the geojson.
"UploadedDa",
	"Uploaded_1",
	"Uploaded_2",
	"Uploaded_3",
	"Uploaded_4",
	"Uploaded_5"
];

var arrYears = [
	2009,
	2010,
	2011,
	2012,
	2013,
	2014
];

var arrAttributes = [ //not clear to me how this is used yet, so need to check if it needs uploaded data
	"medianHomeValue",
	"income",
	"monthlyCost",
	"unemployment",
	"Uploaded_User_Dataset"
];







var bounds = [
    [-180, 10], // Southwest coordinates
    [-45, 65]  // Northeast coordinates
];

mapboxgl.accessToken = 'pk.eyJ1Ijoic2t5d2lsbGlhbXMiLCJhIjoibUI4TlByNCJ9.9UuhBU3ElNiesrd-BcTdPQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v8', //basemap style
    center: [-118, 40], // starting position
    minZoom: 3,
    maxZoom: 8,
    maxBounds: bounds,
    zoom: 3, // starting zoom
});



// Disable default box zooming.
map.boxZoom.disable();

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.Navigation());

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: false
});

// Show the state choropleth first
var level = 'isState';


map.on('load', function() {
    var canvas = map.getCanvasContainer();

    alterHoveredValues();

    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    var start;

    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    var current;

    // Variable for the draw box element.
    var box;


    // Add the source to query. In this example we're using
    // county polygons uploaded as vector tiles
    map.addSource('counties', { //doesn't look like it needs anything from uploaded data
        "type": "vector",
        "url": "mapbox://mapbox.82pkq93d"
    });

    map.addSource('countiesAttribute', { //this does have attributes in it, so may need something from uploaded data, depending on what's being done with this layer
        "type": "geojson",
        "data": "/data/countiesAttribute00.geojson"
    });

    map.addLayer ({ //what does this layer do?
        "id": "countiesAttribute",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "paint": {
            "fill-outline-color": "black",
            "fill-color": "white"
        }
    });

    map.addLayer({ //this starts the letter-number layers. Not sure what they do yet. I think they are the bivariate choropleth colors. So they'd need to link to uploaded data
        "id": "counties-highlighted-A1",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#be64ac",
            "fill-opacity": 0.75
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-B1",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#8c62aa",
            "fill-opacity": 0.75
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-C1",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#3b4994",
            "fill-opacity": 0.75
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-A2",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#dfb0d6",
            "fill-opacity": 0.75
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-B2",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#a5add3",
            "fill-opacity": 0.75
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-C2",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#5698b9",
            "fill-opacity": 0.75,
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-A3",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#e8e8e8",
            "fill-opacity": 0.75,
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-B3",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#ace4e4",
            "fill-opacity": 0.75,
        },
        "filter": ["in", "fips", ""]
    });

    map.addLayer({
        "id": "counties-highlighted-C3",
        "type": "fill",
        "source": "countiesAttribute",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#5ac8c8",
            "fill-opacity": 0.75,
        },
        "filter": ["in", "fips", ""]
    });


    // yes, add new layer for each choropleth class, with filter for the class, try to add every rendered county to each class, desired county will only show up in desired filtered choropleth layer

    // Set `true` to dispatch the event before other functions
    // call it. This is necessary for disabling the default map
    // dragging behaviour.
    canvas.addEventListener('mousedown', mouseDown, true);

     // Return the xy coordinates of the mouse position
    function mousePos(e) {
        var rect = canvas.getBoundingClientRect();
        return new mapboxgl.Point(
            e.clientX - rect.left - canvas.clientLeft,
            e.clientY - rect.top - canvas.clientTop
        );
    }

    function mouseDown(e) {
        // Continue the rest of the function if the shiftkey is pressed.
        if (!(e.shiftKey && e.button === 0)) return;

        // Disable default drag zooming when the shift key is held down.
        map.dragPan.disable();

        // Call functions for the following events
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keydown', onKeyDown);

        // Capture the first xy coordinates
        start = mousePos(e);
    }

    function onMouseMove(e) {
        // Capture the ongoing xy coordinates
        current = mousePos(e);

        // Append the box element if it doesnt exist
        if (!box) {
            box = document.createElement('div');
            box.classList.add('boxdraw');
            canvas.appendChild(box);
        }

        var minX = Math.min(start.x, current.x),
            maxX = Math.max(start.x, current.x),
            minY = Math.min(start.y, current.y),
            maxY = Math.max(start.y, current.y);

        // Adjust width and xy position of the box element ongoing
        var pos = 'translate(' + minX + 'px,' + minY + 'px)';
        box.style.transform = pos;
        box.style.WebkitTransform = pos;
        box.style.width = maxX - minX + 'px';
        box.style.height = maxY - minY + 'px';
    }

    function onMouseUp(e) {
        // Capture xy coordinates
        finish([start, mousePos(e)]);
    }

    function onKeyDown(e) {
        // If the ESC key is pressed
        if (e.keyCode === 27) finish();
    }

    function finish(bbox) {
        // Remove these events now that finish has been called.
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('mouseup', onMouseUp);

        if (box) {
            box.parentNode.removeChild(box);
            box = null;
        }

        // If bbox exists. use this value as the argument for `queryRenderedFeatures`
        if (bbox) {
            var features = map.queryRenderedFeatures(bbox, { layers: ['countiesAttribute'] });

            if (features.length >= 1000) {
                return window.alert('Select a smaller number of features');
            }

            // Run through the selected features and set a filter
            // to match features with unique FIPS codes to activate
            // the `counties-highlighted` layer.
            var filter = features.reduce(function(memo, feature) {
                memo.push(feature.properties.fips);

                //console.log(memo);
                // call function to change colors for choropleth
                //choropleth(feature.properties.FIPS, features);
                return memo;
            }, ['in', 'fips']);

            // so we're finding the unique fips id, and we need to add another filter for if that fips number is to a certain extent
            //map.setFilter("counties-highlighted-A1", ["all", filter, ["<", "medianHome", 50000]]);
            //map.setFilter("counties-highlighted-B1", ["all", filter, [">=", "medianHome", 50000]]);
            //map.setFilter("counties-highlighted", ["all", filter, ["<", "fips", 20000]]);
            //map.setFilter("counties-highlighted-one", ["all", filter, [">=", "fips", 20000]]);

            filterHolder = filter;
            choropleth(filterHolder);
            mouseMoveControl = false;

        }

        map.dragPan.enable();
    }

    map.on('mousemove', function(e) {
        if (mouseMoveControl == false) {
            var features = map.queryRenderedFeatures(e.point, { layers: //not sure what's happening here. does it need attributes from uploaded data?
                ['counties-highlighted-A1',
                 'counties-highlighted-B1',
                 'counties-highlighted-C1',
                 'counties-highlighted-A2',
                 'counties-highlighted-B2',
                 'counties-highlighted-C2',
                 'counties-highlighted-A3',
                 'counties-highlighted-B3',
                 'counties-highlighted-C3']
            });
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

            if (!features.length) {
                popup.remove();
                return;
            }

            var feature = features[0];
        	var arrProperties = [  //so I need to figure out how to add the info for uploaded Data to here - what does
						//feature.properties.one of the columns get? What does feature.properties.one of the attributes get? I need to
						//understand what is needed out of this to know how to get uploaded data to get it
				[feature.properties.medianHome, feature.properties.medianHo_1, feature.properties.medianHo_2, feature.properties.medianHo_3, feature.properties.medianHo_4, feature.properties.medianHo_5],
				[feature.properties.Income_Dat, feature.properties.Income_200, feature.properties.Income_201, feature.properties.Income_202, feature.properties.Income_203, feature.properties.Income_204, feature.properties.Income_205],
				[feature.properties.MonthyCost, feature.properties.MonthlyCos, feature.properties.MonthlyC_1, feature.properties.MonthlyC_2, feature.properties.MonthlyC_3, feature.properties.MonthlyC_4, feature.properties.MonthlyC_5],
				[feature.properties.Unemployme, feature.properties.Unemploy_1, feature.properties.Unemploy_2, feature.properties.Unemploy_3, feature.properties.Unemploy_4, feature.properties.Unemploy_5]
			];


            popup.setLngLat(e.lngLat) //I don't understand what this does yet, so don't understand whether I need to do something with it
                .setText(feature.properties.NAME + " County" + " " + arrProperties[displayPop01][displayPop20] + " " + arrProperties[displayPop10][displayPop20])
                .addTo(map);
        } else {
            return
        }
	});
});


// this function is a work in progress
//inspired by https://github.com/skorasaurus/dtparking/blob/master/index.html#L63
function choroplethExternalData(yData){
	//create a featureLayer method that will be used to load the geojson file
	  var featLayer = L.mapbox.featureLayer().addTo(mizzap);
				 //load your geojson file using loadURL - I don't have a geojson or a url
		featLayer.loadURL('dtparking.geojson');

						// inspired by http://geosprocket.github.io/btv-geographic/social/sociallayers.js
		function getMyColor(myargument) {
    	if (myargument === 'multi-storey') {
        return '#996767'
    	};
    	if (myargument === 'surface') {
        return '#679967'
    	};
    	if (myargument === 'underground') {
        return '#676799'
    	};
		}

						// styles each polygon based on its properties in the geojson file, using leaflet's setStyle
		featLayer.on('ready', function() {
    	featLayer.eachLayer(function(polygon) {
    	polygon.bindPopup('This is a ' + polygon.feature.properties.parking + ' parking lot');
    	console.log(typeof setStyle);
    	polygon.setStyle({
        opacity: 0.55,
        fillOpacity: 0.55,
        fillColor: getMyColor(polygon.feature.properties.parking),
        color: getMyColor(polygon.feature.properties.parking) * 1.04
			});
			});
		});
}
/* from skorasaurus: "The eachLayer method is confusing. This method is being used to say “hey, I want this code (in lines 77-83) to act on every object (all of the parking areas) that’s in featLayer. Layers have different meanings depending on context in geospatial/GIS.

getMyColor is just an arbitrary name that I made to name the function that I made.I still catch myself once in a while of what is function and what is a method….
In several past commits, I didn’t include the ‘feature’ part of the object
because I had mistaken assumed that eachLayer method would go through each object within the layer and that adding ‘feature’ wasn’t necessary.

Beginning at line 63, is the function that will return a different color depending on what is the value of parking. For example, for this polygon parking has a value of ‘surface’ so ‘#679967’ is used as the fillColor for that particular polygon.

polygon and myargument are both arbitrary names that are selected by the coder. If you were to copy and paste this page into as your own, (as well as the dtparking.geojson file at the github repo ), you could rename polygon to
blob and myargument to judgejudy in each place and it’ll work."*/


// function that keep tracks of the year being displayed and the two variables being displayed
function choropleth(x){
	var selectedYear = arrYears.indexOf(2009);

	var selectedYAttribute = yAxisValue;
	var selectedXAttribute = xAxisValue;

	// for single variate, we need to only display the three middle rectangles of bivariate legend
	// so only three filters and layers, not 9
	if (selectedXAttribute == arrAxisValues[0] && selectedYAttribute == arrAxisValues[0]) {
		var yearAttribute01 = arrMedianHomeValue[selectedYear];
		var yearAttribute02 = arrMedianHomeValue[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[0] && selectedYAttribute == arrAxisValues[1]) {
		var yearAttribute01 = arrMedianHomeValue[selectedYear];
		var yearAttribute02 = arrIncome[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[1] && selectedYAttribute == arrAxisValues[0]) {
		var yearAttribute01 = arrIncome[selectedYear];
		var yearAttribute02 = arrMedianHomeValue[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[0] && selectedYAttribute == arrAxisValues[2]) {
		var yearAttribute01 = arrMedianHomeValue[selectedYear];
		var yearAttribute02 = arrUnemployment[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[2] && selectedYAttribute == arrAxisValues[0]) {
		var yearAttribute01 = arrUnemployment[selectedYear];
		var yearAttribute02 = arrMedianHomeValue[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[0] && selectedYAttribute == arrAxisValues[3]) {
		var yearAttribute01 = arrMedianHomeValue[selectedYear];
		var yearAttribute02 = arrMonthlyCost[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[3] && selectedYAttribute == arrAxisValues[0]) {
		var yearAttribute01 = arrMonthlyCost[selectedYear];
		var yearAttribute02 = arrMedianHomeValue[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[0] && selectedYAttribute == arrAxisValues[4]) {
		var yearAttribute01 = arrMedianHomeValue[selectedYear];
	// this is where we put uploaded data 	var yearAttribute02 = arrMonthlyCost[selectedYear];
	 var yearAttribute02 = arrUploadedData[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[1] && selectedYAttribute == arrAxisValues[1]) {
		var yearAttribute01 = arrIncome[selectedYear];
		var yearAttribute02 = arrIncome[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[1] && selectedYAttribute == arrAxisValues[2]) {
		var yearAttribute01 = arrIncome[selectedYear];
		var yearAttribute02 = arrUnemployment[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[2] && selectedYAttribute == arrAxisValues[1]) {
		var yearAttribute01 = arrUnemployment[selectedYear];
		var yearAttribute02 = arrIncome[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[1] && selectedYAttribute == arrAxisValues[3]) {
		var yearAttribute01 = arrIncome[selectedYear];
		var yearAttribute02 = arrMonthlyCost[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[3] && selectedYAttribute == arrAxisValues[1]) {
		var yearAttribute01 = arrMonthlyCost[selectedYear];
		var yearAttribute02 = arrIncome[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[1] && selectedYAttribute == arrAxisValues[4]) {
		var yearAttribute01 = arrIncome[selectedYear];
//this is where we put uploaded data		var yearAttribute02 = arrMonthlyCost[selectedYear];
var yearAttribute02 = arrUploadedData[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[2] && selectedYAttribute == arrAxisValues[2]) {
		var yearAttribute01 = arrUnemployment[selectedYear];
		var yearAttribute02 = arrUnemployment[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[2] && selectedYAttribute == arrAxisValues[3]) {
		var yearAttribute01 = arrUnemployment[selectedYear];
		var yearAttribute02 = arrMonthlyCost[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[2] && selectedYAttribute == arrAxisValues[4]) {
		var yearAttribute01 = arrUnemployment[selectedYear];
	//this is wehre we put uploaded data	var yearAttribute02 = arrMonthlyCost[selectedYear];
	var yearAttribute02 = arrUploadedData[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[3] && selectedYAttribute == arrAxisValues[2]) {
		var yearAttribute01 = arrMonthlyCost[selectedYear];
		var yearAttribute02 = arrUnemployment[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[3] && selectedYAttribute == arrAxisValues[3]) {
		var yearAttribute01 = arrMonthlyCost[selectedYear];
		var yearAttribute02 = arrMonthlyCost[selectedYear];

	} else if (selectedXAttribute == arrAxisValues[3] && selectedYAttribute == arrAxisValues[4]) {
		var yearAttribute01 = arrMonthlyCost[selectedYear];
//this is where we put uploaded data 		var yearAttribute02 = arrMonthlyCost[selectedYear];
var yearAttribute02 = arrUploadedData[selectedYear];
	};
	fvalueIncome(x, yearAttribute01, yearAttribute02);
};


/*
function fvalueValue(year, filter) {
	var yearAttribute01 = arrMedianHomeValue[year];

    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A1", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
};
*/

function fvalueIncome(filter, yearX, yearY) {

	map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearX, xQuantile01], ["<", yearY, yQuantile01]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, [">=", yearX, xQuantile01], ["<", yearX, xQuantile02], ["<", yearY, yQuantile01]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, [">=", yearX, xQuantile02], ["<", yearY, yQuantile01]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearX, xQuantile01], [">=", yearY, yQuantile01], ["<", yearY, yQuantile02]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, [">=", yearX, xQuantile01], ["<", yearX, xQuantile02], [">=", yearY, yQuantile01], ["<", yearY, yQuantile02]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, [">=", yearX, xQuantile02], [">=", yearY, yQuantile01], ["<", yearY, yQuantile02]]);
    map.setFilter("counties-highlighted-A1", ["all", filter, ["<", yearX, xQuantile01], [">=", yearY, yQuantile02]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, [">=", yearX, xQuantile01], ["<", yearX, xQuantile01], [">=", yearY, yQuantile02]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, [">=", yearX, xQuantile02], [">=", yearY, yQuantile02]]);
};


function alterHoveredValues() {
	displayPop01 = arrAxisValues.indexOf(xAxisValue);
	displayPop10 = arrAxisValues.indexOf(yAxisValue);
	displayPop20 = arrYears.indexOf(displayedYear);

	console.log(displayPop01);

};
/*
function fvalueUnemployment(year, filter) {
	var yearAttribute01 = arrMedianHomeValue[year];
	var yearAttribute02 = arrUnemployment[year];

	map.setFilter("counties-highlighted-A1", ["all", filter, [">=", yearAttribute01, 140000], [">=", yearAttribute02, 40]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, ["<", yearAttribute01, 140000], [">=", yearAttribute01, 120000], ["<", yearAttribute02, 40], [">=", yearAttribute02, 35]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, ["<", yearAttribute01, 120000], [">=", yearAttribute01, 100000], ["<", yearAttribute02, 35], [">=", yearAttribute02, 30]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, 100000], [">=", yearAttribute01, 80000], ["<", yearAttribute02, 30], [">=", yearAttribute02, 25]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, ["<", yearAttribute01, 80000], [">=", yearAttribute01, 60000], ["<", yearAttribute02, 25], [">=", yearAttribute02, 20]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, ["<", yearAttribute01, 60000], [">=", yearAttribute01, 50000], ["<", yearAttribute02, 20], [">=", yearAttribute02, 15]]);
    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, 50000], [">=", yearAttribute01, 40000], ["<", yearAttribute02, 15], [">=", yearAttribute02, 10]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, ["<", yearAttribute01, 40000], [">=", yearAttribute01, 30000], ["<", yearAttribute02, 10], [">=", yearAttribute02, 5]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, ["<", yearAttribute01, 30000], ["<", yearAttribute02, 5]]);
};

function fvalueOwnership(year, filter) {
	var yearAttribute01 = arrMedianHomeValue[year];
	var yearAttribute02 = arrMonthlyCost[year];

	map.setFilter("counties-highlighted-A1", ["all", filter, [">=", yearAttribute01, 140000], [">=", yearAttribute02, 2000]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, ["<", yearAttribute01, 140000], [">=", yearAttribute01, 120000], ["<", yearAttribute02, 2000], [">=", yearAttribute02, 1800]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, ["<", yearAttribute01, 120000], [">=", yearAttribute01, 100000], ["<", yearAttribute02, 1800], [">=", yearAttribute02, 1600]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, 100000], [">=", yearAttribute01, 80000], ["<", yearAttribute02, 1600], [">=", yearAttribute02, 1200]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, ["<", yearAttribute01, 80000], [">=", yearAttribute01, 60000], ["<", yearAttribute02, 1200], [">=", yearAttribute02, 1000]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, ["<", yearAttribute01, 60000], [">=", yearAttribute01, 50000], ["<", yearAttribute02, 1000], [">=", yearAttribute02, 800]]);
    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, 50000], [">=", yearAttribute01, 40000], ["<", yearAttribute02, 800], [">=", yearAttribute02, 600]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, ["<", yearAttribute01, 40000], [">=", yearAttribute01, 30000], ["<", yearAttribute02, 600], [">=", yearAttribute02, 300]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, ["<", yearAttribute01, 30000], ["<", yearAttribute02, 300]]);
};

function fincomeIncome(year, filter) {
	var yearAttribute01 = arrIncome[year];

	map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A1", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
};

function fincomeUnemployment(year, filter) {
	var yearAttribute01 = arrIncome[year];
	var yearAttribute02 = arrUnemployment[year];

	map.setFilter("counties-highlighted-A1", ["all", filter, [">=", yearAttribute01, 140000], [">=", yearAttribute02, 40]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, ["<", yearAttribute01, 140000], [">=", yearAttribute01, 120000], ["<", yearAttribute02, 40], [">=", yearAttribute02, 35]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, ["<", yearAttribute01, 120000], [">=", yearAttribute01, 100000], ["<", yearAttribute02, 35], [">=", yearAttribute02, 30]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, 100000], [">=", yearAttribute01, 80000], ["<", yearAttribute02, 30], [">=", yearAttribute02, 25]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, ["<", yearAttribute01, 80000], [">=", yearAttribute01, 60000], ["<", yearAttribute02, 25], [">=", yearAttribute02, 20]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, ["<", yearAttribute01, 60000], [">=", yearAttribute01, 50000], ["<", yearAttribute02, 20], [">=", yearAttribute02, 15]]);
    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, 50000], [">=", yearAttribute01, 40000], ["<", yearAttribute02, 15], [">=", yearAttribute02, 10]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, ["<", yearAttribute01, 40000], [">=", yearAttribute01, 30000], ["<", yearAttribute02, 10], [">=", yearAttribute02, 5]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, ["<", yearAttribute01, 30000], ["<", yearAttribute02, 5]]);
};

function fincomeOwnership(year, filter) {
	var yearAttribute01 = arrIncome[year];
	var yearAttribute02 = arrMonthlyCost[year];

	map.setFilter("counties-highlighted-A1", ["all", filter, [">=", yearAttribute01, 140000], [">=", yearAttribute02, 2000]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, ["<", yearAttribute01, 140000], [">=", yearAttribute01, 120000], ["<", yearAttribute02, 2000], [">=", yearAttribute02, 1800]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, ["<", yearAttribute01, 120000], [">=", yearAttribute01, 100000], ["<", yearAttribute02, 1800], [">=", yearAttribute02, 1600]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, 100000], [">=", yearAttribute01, 80000], ["<", yearAttribute02, 1600], [">=", yearAttribute02, 1200]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, ["<", yearAttribute01, 80000], [">=", yearAttribute01, 60000], ["<", yearAttribute02, 1200], [">=", yearAttribute02, 1000]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, ["<", yearAttribute01, 60000], [">=", yearAttribute01, 50000], ["<", yearAttribute02, 1000], [">=", yearAttribute02, 800]]);
    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, 50000], [">=", yearAttribute01, 40000], ["<", yearAttribute02, 800], [">=", yearAttribute02, 600]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, ["<", yearAttribute01, 40000], [">=", yearAttribute01, 30000], ["<", yearAttribute02, 600], [">=", yearAttribute02, 300]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, ["<", yearAttribute01, 30000], ["<", yearAttribute02, 300]]);
};

function funemploymentUnemployment(year, filter) {
	var yearAttribute01 = arrUnemployment[year];

	map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A1", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
};

function funemploymentOwnership(year, filter) {
	var yearAttribute01 = arrUnemployment[year];
	var yearAttribute02 = arrMonthlyCost[year];

	map.setFilter("counties-highlighted-A1", ["all", filter, [">=", yearAttribute01, 40], [">=", yearAttribute02, 2000]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, ["<", yearAttribute01, 40], [">=", yearAttribute01, 35], ["<", yearAttribute02, 2000], [">=", yearAttribute02, 1800]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, ["<", yearAttribute01, 35], [">=", yearAttribute01, 30], ["<", yearAttribute02, 1800], [">=", yearAttribute02, 1600]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, 30], [">=", yearAttribute01, 25], ["<", yearAttribute02, 1600], [">=", yearAttribute02, 1200]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, ["<", yearAttribute01, 25], [">=", yearAttribute01, 20], ["<", yearAttribute02, 1200], [">=", yearAttribute02, 1000]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, ["<", yearAttribute01, 20], [">=", yearAttribute01, 15], ["<", yearAttribute02, 1000], [">=", yearAttribute02, 800]]);
    map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, 15], [">=", yearAttribute01, 10], ["<", yearAttribute02, 800], [">=", yearAttribute02, 600]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, ["<", yearAttribute01, 10], [">=", yearAttribute01, 5], ["<", yearAttribute02, 600], [">=", yearAttribute02, 300]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, ["<", yearAttribute01, 5], ["<", yearAttribute02, 300]]);

};

function fownershipOwnership(year, filter) {
	var yearAttribute01 = arrMonthlyCost[year];

	map.setFilter("counties-highlighted-A3", ["all", filter, ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C3", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A2", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B2", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C2", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01], ["<", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-A1", ["all", filter, ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-B1", ["all", filter, [">=", yearAttribute01, xQuantile01], ["<", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
    map.setFilter("counties-highlighted-C1", ["all", filter, [">=", yearAttribute01, xQuantile01], [">=", yearAttribute01, yQuantile01]]);
};
*/
