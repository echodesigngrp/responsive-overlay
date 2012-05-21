function OverlayPopover(html, extend) {	
	this.container = $('<div class="overlay-popover-container">'+html+'</div>').css({
		'position': 'absolute',
		'display': 'block',
		'width': '400px',
		'height': '400px',
		'cursor': 'auto',
	});
	
	this.popover = $(this.container).children().first()[0];
		
	this.pixelOffset = 34;
	this.panPadding = 10;
	
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
	var containerPosition = this.getProjection().fromLatLngToContainerPixel(this.marker.getPosition());

	if ( containerPosition ) {
		var x = containerPosition.x - ($(this.popover).outerWidth() / 2);
		var y = containerPosition.y - $(this.popover).outerHeight() - this.pixelOffset;
		
		$(this.popover).data('x', x);
		$(this.popover).data('y', y);
		
		this.pan();
	}

	if ( position ) {
		var x = position.x - ($(this.container).outerWidth() / 2);
		var y = position.y - $(this.container).outerHeight() - this.pixelOffset;
		
		$(this.container).css({ left: x, top: y });
	}
}

OverlayPopover.prototype.popoverBounds = function() {
	var bounds = {
		x: $(this.popover).data('x'),
		y: $(this.popover).data('y'),
		w: $(this.popover).outerWidth(),
		h: $(this.popover).outerHeight()
	};
	
	var string = 'x:'+bounds.x+' y:'+bounds.y+' w:'+bounds.w+' h:'+bounds.h;

	$('title').text(string);
	
	return bounds;
}

OverlayPopover.prototype.pan = function () {

	var map;

	var xOffset = 0, yOffset = 0;

    map = this.getMap();

    if (map instanceof google.maps.Map) {
		var mapDiv = map.getDiv();
		var mapWidth = mapDiv.offsetWidth;
		var mapHeight = mapDiv.offsetHeight;
		var padding = this.panPadding;
		var bounds = this.popoverBounds();
			
		if ( bounds.x < 0 )
		{
			xOffset = bounds.x - 0 - padding;
		}
		else if ( ( bounds.x + bounds.w ) > mapWidth )
		{
			xOffset = (bounds.x + bounds.w) - mapWidth + padding;
		}
		
		if ( (bounds.y < 0 ) )
		{
			yOffset = bounds.y - 0 - padding;
		}
	
		map.panBy(xOffset, yOffset);
	}
}

// Hide overlay container
OverlayPopover.prototype.hide = function() {
	if (this.container) this.container.hide();
	
	this.setMap(null);
}

// Show overlay container
OverlayPopover.prototype.show = function(marker) {
	this.marker = marker;
	this.setMap(this.marker.getMap());

	if (this.container) {
		this.container.show();
		
		this.pan();
	}
}

// Return whether container is visible or not.
OverlayPopover.prototype.is_visible = function() {
	return $(this.container).is(":visible");
}

// Toggle on/off popover.
OverlayPopover.prototype.toggle = function(marker) {
	this.is_visible() ? this.hide() : this.show(marker);
}