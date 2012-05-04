function OverlayPopover(html, extend) {
	var div = $('<div class="overlay_popover_container">'+html+'</div>');
	
	$(div).css({
		'position': 'absolute',
		'display': 'block',
		'width': '400px',
		'height': '400px',
		'cursor': 'auto'
	});
	
	this.div = div;
	
	if ( extend )
	{
		extend(this);
	}
}

// Extend OverlayView
OverlayPopover.prototype = new google.maps.OverlayView();

// Add popover to map
OverlayPopover.prototype.onAdd = function() {
	var div = $(this.div).get(0);

	google.maps.event.addDomListener(div, 'mousedown', function(e) {e.stopPropagation()});
	google.maps.event.addDomListener(div, 'dblclick', function(e) {e.stopPropagation()});
	google.maps.event.addDomListener(div, 'DOMMouseScroll', function(e) {e.stopPropagation()});
	
	var panes = this.getPanes();
	panes.overlayMouseTarget.appendChild(div);
}

// Position popover in map viewport
OverlayPopover.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	
	var position = this.getProjection().fromLatLngToDivPixel(this.marker.getPosition());
	var div = this.div;
	
	var marker_height = 34;
	
	if ( position ) {
		$(this.div).offset({
			left: position.x - ($(div).outerWidth() / 2),
			top: position.y - $(div).outerHeight() - marker_height
		});
	}
}

OverlayPopover.prototype.hide = function() {
	if (this.div) this.div.hide();
}

OverlayPopover.prototype.show = function(marker) {
	if ( this.marker != marker )
	{
		this.marker = marker;
		this.setMap(this.marker.getMap());
	}

	if (this.div) this.div.show();
}

// Toggle on/off popover.
OverlayPopover.prototype.toggle = function(marker) {
	if ( this.div ) {
		if ( $(this.div).is(":visible") ) {
	    	this.hide();
	    } else {
	    	this.show(marker);
	    }
	}
}