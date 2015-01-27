(function() {
  var map = L.map('map', {
    // We have a different attribution control...
    attributionControl: false
  }).setView([40, -97], 5);

  // Make map states linkable
  var hash = new L.Hash(map);

  // Add our basemap
  L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    maxZoom: 12
  }).addTo(map);

  // Add the geologic basemap
  L.tileLayer('http://macrostrat.org/tiles/geologic/{z}/{x}/{y}.png', {
    maxZoom: 12,
    opacity: 0.8
  }).addTo(map);


  // Define our popup out here for ease of adding/removing
  var popup;

  map.on("click", function(d) {
    if (map.getZoom() < 10) {
      // query gmna
      $.getJSON("http://macrostrat.org/api/v1/geologic_units?type=gmna&lat=" + d.latlng.lat + "&lng=" + d.latlng.lng, function(data) {
        var data = data.success.data[0];

        var content = "<h3>GMNA</h3><h2>" + data.interval_name + "</h2><strong>Age: </strong>" + data.min_age + " - " + data.max_age + "<br>";

        if (data.rocktype) {
          content += "<strong>Rock type: </strong>" + data.rocktype + "<br>";
        }
        if (data.lithology) {
          content += "<strong>Lithology: </strong>" + data.lithology + "<br>";
        }

        popup = L.popup()
          .setLatLng(d.latlng)
          .setContent(content)
          .openOn(map);
      });
    } else {
      // query gmus
      $.getJSON("http://macrostrat.org/api/v1/mobile/point_details?lat=" + d.latlng.lat + "&lng=" + d.latlng.lng, function(data) {

        var data = data.success.data[0].gmus,
            rocktype = "";

        if (data.rocktype1) {
          rocktype += data.rocktype1
        }
        if (data.rocktype2) {
          rocktype += ", " + data.rocktype2
        }
        if (data.rocktype3) {
          rocktype += ", " + data.rocktype3
        }
        var content = "<h3>GMUS</h3><h2>" + data.unit_name + "</h2><strong>ID: </strong>" + data.gid + "<br><strong>Age: </strong>" + data.unit_age + "<br><strong>Rock type: </strong>" + rocktype + "<br>";

        if (data.unitdesc) {
          content += "<strong>About: </strong>" + data.unitdesc + "<br>"; 
        }

        popup = L.popup()
          .setLatLng(d.latlng)
          .setContent(content)
          .openOn(map);
      });
    }
  });

  // Hide popups when map state changes
  map.on("zoomstart, movestart", function() {
    if (map.hasLayer(popup)) {
      map.removeLayer(popup);
    }
  });

  // Show attribution
  $("#info-link").click(function(d) {
    d.preventDefault();
    $(".attr-container").css("visibility", "visible");
  });

  // Hide attribution
  $(".attr-container").click(function() {
    $(this).css("visibility", "hidden");
  });

})();