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
	var containerPosition = this.getProjection().fromLatLngToContainerPixel(this.marker.getPosition());

	if ( containerPosition ) {
		var x = containerPosition.x - ($(this.container).outerWidth() / 2);
		var y = containerPosition.y - $(this.container).outerHeight() - this.pixelOffset;
		
		$(this.container).data('x', x);
		$(this.container).data('y', y);
		
		console.log(this.container.data('y'));
	}

	if ( position ) {
		var x = position.x - ($(this.container).outerWidth() / 2);
		var y = position.y - $(this.container).outerHeight() - this.pixelOffset;
		
		$(this.container).css({ left: x, top: y });
	}
}

// OverlayPopover.prototype.containerOrigin = function() {
// 	var coords = this.marker.getPosition();
// 	var position = this.getProjection().fromLatLngToContainerPixel(coords);
// 	var centerX = position.x;
// 	var centerY = position.y - this.pixelOffset;	
// 	
// 	var x = centerX - ($(this.container).outerWidth() / 2);
// 	var y = centerY + $(this.container).outerHeight();
// 	
// 	console.log(x + ' ' + y);
// }

OverlayPopover.prototype.containerBounds = function() {
	// var coords = this.marker.getPosition();
	// var position = this.getProjection().fromLatLngToDivPixel(coords);
	// var centerX = position.x;
	// var centerY = position.y - this.pixelOffset;
	// 	
	// var swx = centerX - ($(this.container).outerWidth() / 2);
	// var swy = centerY;
	// var swp = 
	// 
	// var nex = centerX + ($(this.container).outerWidth() / 2);
	// var ney = centerY + $(this.container).outerHeight();
}

OverlayPopover.prototype.pan = function () {

	var map;

	var xOffset = 0, yOffset = 0;

    map = this.getMap();
// 
    if (map instanceof google.maps.Map) {
		var mapDiv = map.getDiv();
		var mapWidth = mapDiv.offsetWidth;
		var mapHeight = mapDiv.offsetHeight;
	// 	var overlayOffsetX = 0;
	// 	var overlayOffsetY = 0;
	// 	var overlayWidth = $(this.container).width();
	// 	var overlayHeight = $(this.container).height();
	// 	var padding = 10;
	// 	// var position = this.getProjection().fromLatLngToDivPixel(coords);
	// 	
	// 	
		var containerLeft = $(this.container).data('x');
		var containerTop =  $(this.container).data('y');
		var containerWidth = $(this.container).outerWidth();
		var containerHeight = $(this.container).outerHeight();
		
		if ( (containerLeft + containerWidth) > mapWidth ) {
			xOffset = mapWidth - (containerLeft + containerWidth) - padding;
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