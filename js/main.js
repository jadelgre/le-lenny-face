+function() {
	var $canvas = $('#lenny');

	$canvas.lenny();

	var modes = $canvas.data('lenny').modes;

	$.each(modes, function(key, value) {
		$('#mode-select')
		.append($("<option></option>")
		.attr("value", value)
		.text(value));
	});

	$('#mode-select').change(function() {
		$canvas.data('lenny').setMode($('#mode-select').find(':selected').val());
	});
}();