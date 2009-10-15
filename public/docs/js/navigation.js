var nav_items = document.getElementById('navigation').getElementsByTagName('a');
for(var i = 0; i < nav_items.length; i++) {
	var stripped_href = nav_items[i].href.match(/([^\/]+)\/$/)[1];
	if(document.location.href.match(stripped_href)) {
		nav_items[i].parentNode.className = 'selected';
		nav_items[i].parentNode.insertBefore(document.createTextNode("\u203a "), nav_items[i]);
		break;
	}
}