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
      $.getJSON("http://macrostrat.org/api/v1/geologic_units?type=gmus&lat=" + d.latlng.lat + "&lng=" + d.latlng.lng, function(data) {

        var data = data.success.data[0],
            rocktype = "";

        if (data.rt1) {
          rocktype += data.rt1
        }
        if (data.rt2) {
          rocktype += ", " + data.rt2
        }
        if (data.rt3) {
          rocktype += ", " + data.rt3
        }

        // Build the lithology
        var lithology = "";
        for (var i = 1; i < 6; i++) {
          if (data["lith" + i]) {
            if (i === 1) {
              lithology += data["lith" + i];
            } else {
              lithology += ", " + data["lith" + i];
            }
          }
        }

        var content = "<h3>GMUS</h3><h2>" + data.unit_name + "</h2><strong>ID: </strong>" + data.gid + "<br><strong>USGS info: </strong><a target='_blank' href='http://mrdata.usgs.gov/geology/state/sgmc-unit.php?unit=" + data.unit_link + "'>" + data.unit_link + "</a><br><strong>Age: </strong>" + data.unit_age + "<br><strong>Age range: </strong>" + data.min_age + " - " + data.max_age + "<br><strong>Rock type: </strong>" + rocktype + "<br><strong>Lithology: </strong>" + lithology;

        if (data.unitdesc) {
          content += "<br><strong>About: </strong>" + data.unitdesc + "<br>"; 
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