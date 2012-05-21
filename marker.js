function OverlayMarker(options, extend) {
	var className = options.className ? options.className : '';
	this.coord = options.coord;
	this.map = options.map;
			
	this.marker = $('<div class="marker '+className+'"></div>').css({
		'position': 'absolute',
		'display': 'block',
		'cursor': 'pointer'
	});
		
	this.setMap(this.map);
			
	if ( extend )
	{
		extend(this);
	}
}

// Extend OverlayView
OverlayMarker.prototype = new google.maps.OverlayView();

// Add popover to map
OverlayMarker.prototype.onAdd = function() {	
	var marker = this.marker.get(0);
	
	var events = ["mousedown", "mouseover", "mouseout", "mouseup",
      "click", "dblclick", "touchstart", "touchend", "touchmove"];

	for (i = 0; i < events.length; i++) {
		google.maps.event.addDomListener(marker, events[i], function(e) {e.stopPropagation()});
	}
	
	var self = this;
	
	google.maps.event.addDomListener(marker, 'click', function() {
	    google.maps.event.trigger(self, 'click');
	});
	
	var panes = this.getPanes();

	panes.overlayMouseTarget.appendChild(marker);
}

OverlayMarker.prototype.getPosition = function() {	
	return this.coord;
}

OverlayMarker.prototype.getSize = function() {	
	return {
		width: $(this.marker).width(),
		height: $(this.marker).height()
	}
}

OverlayMarker.prototype.onRemove = function() {	
	$(this.marker).remove();
}

// Position popover in map viewport
OverlayMarker.prototype.draw = function() {
	var position = this.getProjection().fromLatLngToDivPixel(this.coord);

	if ( position ) {
		$(this.marker).css({
			left: position.x - ($(this.marker).outerWidth() / 2),
			top: position.y - $(this.marker).outerHeight()
		});
	}
}