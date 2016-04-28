function setupTimeseriesAnimation() {
	
	$('#slider .ui-slider-handle').on('click', function() {

		$('#slider .ui-slider-handle').off('click');
		$('#slider .ui-slider-handle .fa').removeClass('fa-play');

		var sliderVal = $('#slider').slider("value");
		var sliderMax = $('#slider').slider("option", "max");
		for (var i = 0; i < sliderMax-sliderVal; i++) {

			setTimeout(function(prevSliderVal) {
				oneAnimationStep(prevSliderVal);
			}, i*1500, sliderVal+i);

		}

	}).append("<i class='fa fa-play'></i>");

}

function oneAnimationStep(prevSliderVal) {

	$('#slider').slider("value", prevSliderVal+1);
				
	if (prevSliderVal == $('#slider').slider("option", "max")-1) {

		$('#slider .ui-slider-handle .fa').addClass('fa-fast-backward');

		$('#slider .ui-slider-handle').off('click');
		$('#slider .ui-slider-handle').on('click', function() {

			$('#slider').slider("value", $('#slider').slider("option", "min"));
			$('#slider .ui-slider-handle .fa').removeClass('fa-fast-backward').addClass('fa-play');
			$('#slider .ui-slider-handle').off('click');
			setupTimeseriesAnimation();

		});
	}

}