var autoExpandInput = function(target, text, char_code, min_width) {
	
	// if test storage p doesn't exist, create it
	if(!document.getElementById('width_marker')) {
		var width_marker = document.createElement('p');
		width_marker.setAttribute('id','width_marker');
		width_marker.setAttribute('style','display: inline; padding: 1px 4px; position: absolute; visibility: hidden;');
		document.body.appendChild(width_marker);
	} else {
		var width_marker = document.getElementById('width_marker');
	}

	// convert passed char_code into a real ascii character and append it into the text var
	if(char_code !== null) text += String.fromCharCode(char_code);
	// insert text
	width_marker.innerHTML = text;
	// resize target
	if(width_marker.offsetWidth >= min_width) target.style.width = width_marker.offsetWidth + 'px';
	else target.style.width = min_width + 'px';
	// finally append character to the input
	target.value = text;
	
	return text;
}

var filter = function(filter_text, targets, char_code, default_value) {
	var target = targets,
		filter_text = autoExpandInput($('input#filter')[0], filter_text, char_code, 53),
		filter_text_re = new RegExp(filter_text.replace(/\\/g, ''), 'ig');
	
	// if filter text is the default value, show everything
	var default_value_re = new RegExp(('^'+default_value+'$').replace(/\\/g, ''), 'ig');
	if((filter_text).match(default_value_re)) {
		// show everything
		targets.show();
		// hide all no-result elements
		$('li.no-results', targets.parentNode).hide();
		// return focus
		if(char_code) $('input#filter')[0].focus();
		// escape this function
		return;
	}
	
	// hide all no-result elements
	$('li.no-results', targets.parentNode).hide();
	
	// hide all targets
	targets.hide();
	
	// then show any targets which match the filter_text, or have a column title which matches the filter_text
	targets.filter(function() {
		return ($(this).text().match(filter_text_re) || $(this).parent().prev().text().match(filter_text_re));
	}).show();
	
	// collect parents and loop through to see if they are now empty
	var parents = $(targets).parent();
	for(var i = 0; i < parents.length; i++) {
		// show no-results text if no matches found
		if($('li:not(li.no-results):visible', parents[i]).length < 1) $('li.no-results', parents[i]).show();
	}
};

$(function() {
	var filter_input = $('input#filter'),
		default_value = 'Selected';
	
	// if a default value isn't stored, store it
	if(!filter_input.data('default_value')) filter_input.data('default_value', default_value);
	
	// if filter text is empty on page load, fill it with the default value
	if(filter_input[0].value == '') filter_input[0].value = default_value; 
	else filter(filter_input[0].value, $('ul.project-list li:not(li.no-results)'), null, default_value);
	
	// filter-specific events
	filter_input.focus(function() {
		if(this.value == '' || this.value == $(this).data('default_value')) this.value = '';
	});
	filter_input.blur(function() {
		if(this.value == '') this.value = $(this).data('default_value');
	});
	filter_input.keypress(function(e) {
		// if the key is an alphanumeric character or a space and the alt, ctrl, shift or meta keys were not pressed, pass through the char_code
		var char_code = (!(e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) && ((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 91 && e.charCode <= 122) || e.charCode == 32)) ? e.charCode : null;
		var _this = this;
		setTimeout(function() { filter(_this.value, $('ul.project-list li:not(li.no-results)'), char_code, default_value); }, 10);
		// if we have an alphanumeric or space character, don't insert it using the default method
		if(char_code) console.debug(char_code);
		if(char_code) return false;
	});
	
	// insert 'no results' text into each category, then hide them
	$('ul.project-list').prepend('<li class="no-results col four"><em class="background">No results</em></li>').children('li.no-results').hide();
});