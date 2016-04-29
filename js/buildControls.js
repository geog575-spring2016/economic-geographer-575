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
			loadData(plot, $("#xAxisDropdown option[selected]")[0].value, ui.item.value);
		},
	});

	$("#xAxisDropdown").selectmenu({
		width: 230,
		position: { my : "left bottom", at: "left top" },
		change: function(event, ui) {
			loadData(plot, ui.item.value, $("#yAxisDropdown option[selected]")[0].value);
		},
	});

	$('#dropdownContainer').position({
		my: 'center bottom',
		at: 'left+250 bottom-10',
		of: window,
	});

}