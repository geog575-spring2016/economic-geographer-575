function setupTimeseriesAnimation() {
	
	$('#slider .ui-slider-handle').on('click', function() {

		$('#slider .ui-slider-handle').off('click');
		$('#slider .ui-slider-handle .fa').removeClass('fa-play');

		var intervalID = setInterval(oneAnimationStep, 1500);

		function oneAnimationStep() {

			var prevSliderVal = $('#slider').slider("value");
			$('#slider').slider("value", prevSliderVal+1);
						
			if (prevSliderVal == $('#slider').slider("option", "max")-1) {

				clearInterval(intervalID);
				setTimeout(function() {
					$('#slider .ui-slider-handle .fa').addClass('fa-fast-backward');
				}, 1500);

				$('#slider .ui-slider-handle').on('click', function() {

					$('#slider').slider("value", $('#slider').slider("option", "min"));
					$('#slider .ui-slider-handle .fa').removeClass('fa-fast-backward').addClass('fa-play');
					$('#slider .ui-slider-handle').off('click');
					setupTimeseriesAnimation();

				});
			}

		}

	}).append("<i class='fa fa-play'></i>");

}

function setupDataDropdowns(plot) {

	$("#yAxisDropdown").selectmenu({
		width: 230,
		position: { my : "left bottom", at: "left top" },
		change: function(event, ui) {
			loadData(plot, $('#xAxisDropdown').val(), ui.item.value);
			$('#slider').slider("destroy");
			
			//store Y value in variable for map display
			yAxisValue = ui.item.value;
			
			//call choropleth function to update map
			choropleth(filterHolder);
		},
	});

	$("#xAxisDropdown").selectmenu({
		width: 230,
		position: { my : "left bottom", at: "left top" },
		change: function(event, ui) {
			loadData(plot, ui.item.value, $('#yAxisDropdown').val());
			$('#slider').slider("destroy");
			
			//store X value in variable for map display
			xAxisValue = ui.item.value;
			
			//call choropleth function to update map
			choropleth(filterHolder);
		},
	});

	$('#dropdownContainer').position({
		my: 'center bottom',
		at: 'left+250 bottom-25',
		of: window,
	});

}