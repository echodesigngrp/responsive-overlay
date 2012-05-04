function OverlayPopover(html, extend) {
	var container = $('<div class="overlay_popover_container">'+html+'</div>');
	
	$(container).css({
		'position': 'absolute',
		'display': 'block',
		'width': '400px',
		'height': '400px',
		'cursor': 'auto'
	});
	
	this.container = container;
	
	if ( extend )
	{
		extend(this);
	}
}

// Extend OverlayView
OverlayPopover.prototype = new google.maps.OverlayView();

// Add popover to map
OverlayPopover.prototype.onAdd = function() {
	var div = $(this.container).get(0);

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
	var div = this.container;
	
	var marker_height = 34;
	
	if ( position ) {
		$(this.container).offset({
			left: position.x - ($(div).outerWidth() / 2),
			top: position.y - $(div).outerHeight() - marker_height
		});
	}
}

OverlayPopover.prototype.hide = function() {
	if (this.container) this.container.hide();
}

OverlayPopover.prototype.show = function(marker) {
	if ( this.marker != marker )
	{
		this.marker = marker;
		this.setMap(this.marker.getMap());
	}

	if (this.container) this.container.show();
}

// Toggle on/off popover.
OverlayPopover.prototype.toggle = function(marker) {
	if ( this.container ) {
		if ( $(this.container).is(":visible") ) {
	    	this.hide();
	    } else {
	    	this.show(marker);
	    }
	}
}