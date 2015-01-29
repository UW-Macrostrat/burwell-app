//(function() {
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


  // Define our marker out here for ease of adding/removing
  var marker;

  // Custom desaturated icon
  var bwIcon = L.icon({
    iconUrl: 'js/images/marker-icon-bw-2x.png',
    shadowUrl: 'js/images/marker-shadow.png',
    iconSize: [25,41],
    iconAnchor: [12, 41]
  });

  map.on("click", function(d) {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }

   // marker = L.marker(d.latlng).addTo(map);
    marker = L.marker(d.latlng, {icon: bwIcon}).addTo(map);


    if (map.getZoom() < 10) {
      // query gmna
      $.getJSON("http://macrostrat.org/api/v1/geologic_units?type=gmna&lat=" + d.latlng.lat + "&lng=" + d.latlng.lng, function(data) {
        var data = data.success.data[0];

        var content = "<h3>GMNA</h3><hr><h2>" + ((data.interval_name) ? data.interval_name : "Unknown interval") + "</h2><strong>Age: </strong>" + data.min_age + " - " + data.max_age + "<br>";

        if (data.rocktype) {
          content += "<strong>Rock type: </strong>" + data.rocktype + "<br>";
        }
        if (data.lithology) {
          content += "<strong>Lithology: </strong>" + data.lithology + "<br>";
        }

        setUnitInfoContent(content, d.latlng);

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

        var content = "<h3>GMUS</h3><hr><h2>" + data.unit_name + "</h2><strong>ID: </strong>" + data.gid + "<br><strong>USGS info: </strong><a target='_blank' href='http://mrdata.usgs.gov/geology/state/sgmc-unit.php?unit=" + data.unit_link + "'>" + data.unit_link + "</a><br><strong>Age: </strong>" + data.unit_age + "<br><strong>Age range: </strong>" + data.min_age + " - " + data.max_age + "<br><strong>Rock type: </strong>" + rocktype + "<br><strong>Lithology: </strong>" + lithology;

        if (data.unitdesc) {
          content += "<br><strong>About: </strong>" + data.unitdesc + "<br>"; 
        }

        setUnitInfoContent(content, d.latlng);

      });
    }
  });

  // Hide info bars and marker when map state changes, window is resized, or bar is closed
  map.on("zoomstart, movestart", hideInfoAndMarker);
  $(window).on("resize", hideInfoAndMarker);
  $(".close").click(hideInfoAndMarker);

  // Show attribution
  $("#info-link").click(function(d) {
    d.preventDefault();
    $(".attr-container").css("visibility", "visible");
  });

  // Hide attribution
  $(".attr-container").click(function() {
    $(this).css("visibility", "hidden");
  });

  
  // Removes the marker from the map and hides info bars
  function hideInfoAndMarker() {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
    closeRightBar();
    closeBottomBar();
  }

  // Update and open the unit info bars
  function setUnitInfoContent(html, ll) {
    $(".unit_info_content").html(html);
    toggleUnitInfoBar(ll);
  }

  // Open the right info bar depending on the screen orientation
  function toggleUnitInfoBar(ll) {
    // Landscape
    if (window.innerWidth > window.innerHeight) {
      centerMapRight(ll);
      openRightBar();
    } else {
    // Portrait
      centerMapBottom(ll);
      openBottomBar();
    }
  }

  function toggleRightBar() {
    if ($("#unit_info_right").hasClass("moveRight")) {
      closeRightBar();
    } else {
      openRightBar();
    }
  }
  function openRightBar() {
    $("#unit_info_right").addClass("moveRight");
  }

  function closeRightBar() {
    $("#unit_info_right").removeClass("moveRight");
  }

  function toggleBottomBar() {
    if ($("#unit_info_bottom").hasClass("moveDown")) {
      closeBottomBar();
    } else {
      openBottomBar();
    }
  }
  function openBottomBar() {
    $("#unit_info_bottom").addClass("moveDown");
  }
  function closeBottomBar() {
    $("#unit_info_bottom").removeClass("moveDown");
  }

  /* Via https://gist.github.com/missinglink/7620340 */
  L.Map.prototype.panToOffset = function (latlng, offset, options) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0],
        y = this.latLngToContainerPoint(latlng).y - offset[1],
        point = this.containerPointToLatLng([x, y]),
        opts = (options) ? options : {"animate": true, "duration": 0.6, "noMoveStart": true};

    return this.setView(point, this._zoom, { pan: opts })
  }

  function centerMapRight(ll){
    var contentWidth = $("#unit_info_right").width() / 2;
    map.panToOffset( ll, [ -contentWidth, 0 ] );
  }

  function centerMapBottom(ll){
    var contentWidth = $("#unit_info_bottom").height() / 2;
    map.panToOffset( ll, [ 0, -contentWidth ] );
  }

//})();