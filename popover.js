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
	var popover = $('.popover', this.container).get(0);

	google.maps.event.addDomListener(popover, 'mousedown', function(e) {e.stopPropagation()});
	google.maps.event.addDomListener(popover, 'dblclick', function(e) {e.stopPropagation()});
	google.maps.event.addDomListener(popover, 'DOMMouseScroll', function(e) {e.stopPropagation()});
	
	var panes = this.getPanes();
	panes.floatPane.appendChild(container);
}

OverlayPopover.prototype.onRemove = function() {	
	$(this.container).remove();
}

// Position popover in map viewport
OverlayPopover.prototype.draw = function() {
	var position = this.getProjection().fromLatLngToDivPixel(this.marker.getPosition());

	if ( position ) {
		$(this.container).css({
			left: position.x - ($(this.container).outerWidth() / 2),
			top: position.y - $(this.container).outerHeight() - this.pixelOffset
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