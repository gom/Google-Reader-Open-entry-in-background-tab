var is_press_key = function (e, key, with_shift) {
	return (! at_input_area(e)
          && ! (e.altKey || e.ctrlKey || e.metaKey)
          && e.which == key
          && (with_shift == false || (with_shift == true && e.shiftKey)));
}

var at_input_area = function (e) {
  area_name = e.target.nodeName.toLowerCase();
  return area_name == 'input' || area_name == 'textarea';
}

var mouse_click_event = function () {
	var mouse_event = document.createEvent('MouseEvents');
	mouse_event.initMouseEvent('click', true, true);
	return mouse_event;
}

var mark_as_read = function (node) {
	var mouse_event = mouse_click_event();
	node.dispatchEvent(mouse_event); // mark as read
	node.dispatchEvent(mouse_event); // close entry for list view
}

var get_url = function (node) {
	if(! node) return false;
	return href_node_by_view_mode(node).getAttribute('href');
}

var href_node_by_view_mode = function (node) {
	var href_node = '';
	switch(true) {
	case (node.getElementsByClassName('card-content')[0] != undefined): // Expand View
	case (node.getAttribute('class') == 'entry-container'): // Reader Play!
		href_node = 'entry-title-link';
		break;
	default: // List View
		href_node = 'entry-original';
	}
  return node.getElementsByClassName(href_node)[0];
}


if (! gr_star_opener) {
	var gr_star_opener = function(e) {
		var background_key = 86; // v
		var max_tab_open = 5;

		if (! is_press_key(e, background_key, true)) return true;
		var entries = document.getElementsByClassName('entry');

		for (var i = 0, len = entries.length, m = 0; i < len && m < max_tab_open; i++) {
			var entry = entries[i];
			var star = document.evaluate('.//div[contains(@class, "item-star-active")]', entry, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			if (star.snapshotLength == 0) continue;

			var url = get_url(entry);
			if (! url) return true;
			chrome.extension.sendRequest({ "url" : url });
			m++;
			star.snapshotItem(0).dispatchEvent(mouse_click_event()); // mark as read

			e.stopPropagation();
			e.preventDefault();
		}
	}
}
document.addEventListener("keydown", gr_star_opener, true);

if (! gr_in_bg_event) {
	var gr_in_bg_event = function(e) {
		var background_key = 86; // v
		if (! is_press_key(e, background_key, false)) return true;
		var current_entry = document.getElementById('current-entry');
		var url = get_url(current_entry);
		if (! url) return true;
		chrome.extension.sendRequest({ "url" : url });
		mark_as_read(current_entry.childNodes[0]);

		// event propagation
		e.stopPropagation();
		e.preventDefault();
	}
}
document.addEventListener("keydown", gr_in_bg_event, true);
