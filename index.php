<!DOCTYPE html>
<html>
  <head>
    <title>Google Maps</title>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta charset="UTF-8">
    <style type="text/css">
      html, body, #map_canvas {
        margin: 0;
        padding: 0;
        height: 100%;
      }
    </style>
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
	<script src="popover.js"></script>
	<link href="css/style.css" rel="stylesheet" />
    <script type="text/javascript">
      var map;
      function initialize() {
		var coord = new google.maps.LatLng(41.878114, -87.629798);
	
        var myOptions = {
          zoom: 16,
          center: coord,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'),
            myOptions);

	    var marker = new google.maps.Marker({
	        position: coord,
	        map: map,
	    });
	
		var html = '<div class="popover">This is custom</div>';
		
		var popover = new OverlayPopover(html);
		
		google.maps.event.addListener(marker, 'click', function() {	
			popover.toggle(marker);
	    });
      }

      google.maps.event.addDomListener(window, 'load', initialize);
    </script>
  </head>
  <body>
    <div id="map_canvas"></div>
  </body>
</html>