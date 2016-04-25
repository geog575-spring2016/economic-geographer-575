var mouseMoveControl = true;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2t5d2lsbGlhbXMiLCJhIjoibUI4TlByNCJ9.9UuhBU3ElNiesrd-BcTdPQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v8', //basemap style
    center: [-74.50, 40], // starting position
    zoom: 4 // starting zoom
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
    map.addSource('counties', {
        "type": "vector",
        "url": "mapbox://mapbox.82pkq93d"
    });

    map.addLayer({
        "id": "counties",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
            "fill-outline-color": "rgba(0,0,0,0.1)",
            "fill-color": "rgba(0,0,0,0.1)"
        }
    });
    
    map.addLayer({
        "id": "counties-highlighted",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "interactive": true,
        "paint": {
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.75
        },
        "filter": ["in", "FIPS", ""]
    });
    
    map.addLayer({
    	"id": "counties-highlighted-one",
    	"type": "fill",
    	"source": "counties",
    	"source-layer": "original",
    	"interactive": true,
    	"paint": {
    		"fill-outline-color": "#484896",
    		"fill-color": "#fff",
    		"fill-opacity": 0.75
    	},
    	"filter": ["in", "FIPS", ""]
    });
    
    map.addLayer({
    	"id": "counties-highlighted-two",
    	"type": "fill",
    	"source": "counties",
    	"source-layer": "original",
    	"interactive": true,
    	"paint": {
    		"fill-outline-color": "#484896",
    		"fill-color": "#fff",
    		"fill-opacity": 0.75
    	},
    	"filter": ["in", "FIPS", ""]
    });
    
    map.addLayer({
    	"id": "counties-highlighted-three",
    	"type": "fill",
    	"source": "counties",
    	"source-layer": "original",
    	"interactive": true,
    	"paint": {
    		"fill-outline-color": "#484896",
    		"fill-color": "#fff",
    		"fill-opacity": 0.75
    	},
    	"filter": ["in", "FIPS", ""]
    });
    
    map.addLayer({
    	"id": "counties-highlighted-four",
    	"type": "fill",
    	"source": "counties",
    	"source-layer": "original",
    	"interactive": true,
    	"paint": {
    		"fill-outline-color": "#484896",
    		"fill-color": "#fff",
    		"fill-opacity": 0.75
    	},
    	"filter": ["in", "FIPS", ""]
    });
    
    map.addLayer({
    	"id": "counties-highlighted-five",
    	"type": "fill",
    	"source": "counties",
    	"source-layer": "original",
    	"interactive": true,
    	"paint": {
    		"fill-outline-color": "#484896",
    		"fill-color": "#fff",
    		"fill-opacity": 0.75,
    	},
    	"filter": ["in", "FIPS", ""]
    });
    // maybe add a new layer for each different choropleth color, instead of new layer for each county?
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
            var features = map.queryRenderedFeatures(bbox, { layers: ['counties'] });

            if (features.length >= 1000) {
                return window.alert('Select a smaller number of features');
            }

            // Run through the selected features and set a filter
            // to match features with unique FIPS codes to activate
            // the `counties-highlighted` layer.
            var filter = features.reduce(function(memo, feature) {
                memo.push(feature.properties.FIPS);
                
                console.log(memo);
                // call function to change colors for choropleth
            	//choropleth(feature.properties.FIPS, features);
                return memo;
            }, ['in', 'FIPS']);
            
         	// so we're finding the unique fips id, and we need to add another filter for if that fips number is to a certain extent
            map.setFilter("counties-highlighted", ["all", filter, ["<", "FIPS", 20000]]);
            map.setFilter("counties-highlighted-one", ["all", filter, [">=", "FIPS", 20000]]);
            mouseMoveControl = false;
        }

        map.dragPan.enable();
    }
    
    map.on('mousemove', function(e) {
    	if (mouseMoveControl == false) {
			var features = map.queryRenderedFeatures(e.point, { layers: ['counties-highlighted', 'counties-highlighted-one'] });
			map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
		
			if (!features.length) {
            	popup.remove();
            	return;
        	}
        
			var feature = features[0];
		
			popup.setLngLat(e.lngLat)
            	.setText(feature.properties.COUNTY + " " + feature.properties.FIPS)
            	.addTo(map);
        } else {
        	return
        }
	});
	
	
	// function to retrieve data and change colors based on data retrieved
	// create a new layer for each county? loading times?
	// function may be obsolete now
	function choropleth(x, y){
		console.log(x);
		console.log(y.length);
		map.setPaintProperty("counties-highlighted", "fill-color", "#fff");
	};
});