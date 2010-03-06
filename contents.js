var background_key = 'v';

if (! gr_in_bg_event) {
	var gr_in_bg_event = function(e) {
		if (e.target.nodeName.toLowerCase() != 'input' && ! (e.altKey || e.ctrlKey || e.metaKey) && String.fromCharCode(e.which) === background_key) {
			var current_entry = document.getElementById('current-entry');
			var url = (function () {
									if(! current_entry) return false;
									var href_node = (current_entry.getElementsByClassName('card-content')[0]) ? 'entry-title-link' : 'entry-original';
									return current_entry.getElementsByClassName(href_node)[0].getAttribute('href');
								 })();

			if (! url) return true;
			chrome.extension.sendRequest({ "url" : url });

			// simulate mark as read
			var mouse_event = document.createEvent('MouseEvents');
			mouse_event.initMouseEvent('click', true, true);
			current_entry.childNodes[0].dispatchEvent(mouse_event); // mark as read
			current_entry.childNodes[0].dispatchEvent(mouse_event); // close entry for list view

			// event propagation
			e.stopPropagation();
			e.preventDefault();
		}
	}
}
document.addEventListener("keypress", gr_in_bg_event, true);
