function OverlayPopover(html, extend) {	
	this.container = $('<div class="overlay-popover-container">'+html+'</div>').css({
		'position': 'absolute',
		'display': 'block',
		'width': '400px',
		'height': '400px',
		'cursor': 'auto',
	});
	
	this.pixelOffset = 34;
	
	if ( extend )
	{
		extend(this);
	}
}

// Extend OverlayView
OverlayPopover.prototype = new google.maps.OverlayView();

// Add popover to map
OverlayPopover.prototype.onAdd = function() {	
	var container = $(this.container).get(0);
	var popover = $(this.container).children().first().get(0);
	
	var events = ["mousedown", "mouseover", "mouseout", "mouseup",
      "click", "dblclick", "touchstart", "touchend", "touchmove"];

	for (i = 0; i < events.length; i++) {
		google.maps.event.addDomListener(popover, events[i], function(e) {e.stopPropagation()});
	} 
	
	var panes = this.getPanes();
	panes.floatPane.appendChild(container);
}

OverlayPopover.prototype.onRemove = function() {	
	$(this.container).remove();
}

// Position popover in map viewport
OverlayPopover.prototype.draw = function() {
	var position = this.getProjection().fromLatLngToDivPixel(this.marker.getPosition());
	
	var offset = this.pixelOffset;
	
	if ( this.marker.getSize )
	{
		offset = this.marker.getSize().height;
	}

	if ( position ) {
		$(this.container).css({
			left: position.x - ($(this.container).outerWidth() / 2),
			top: position.y - $(this.container).outerHeight() - offset
		});
	}
}

// Hide overlay container
OverlayPopover.prototype.hide = function() {
	if (this.container) this.container.hide();
}

// Show overlay container
OverlayPopover.prototype.show = function(marker) {
	if ( this.marker != marker )
	{
		this.marker = marker;
		this.setMap(this.marker.getMap());
	}

	if (this.container) this.container.show();
}

// Return whether container is visible or not.
OverlayPopover.prototype.is_visible = function() {
	return $(this.container).is(":visible");
}

// Toggle on/off popover.
OverlayPopover.prototype.toggle = function(marker) {
	this.is_visible() ? this.hide() : this.show(marker);
}