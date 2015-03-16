(function() {
  var map = L.map('map', {
    // We have a different attribution control...
    attributionControl: false,
    minZoom: 2
  }).setView([40, -97], 5);

  // Make map states linkable
  var hash = new L.Hash(map);

  // Add our basemap
  var stamen = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png').addTo(map);
  stamen.setZIndex(1);

  var gmnaFaults = L.tileLayer('http://macrostrat.org/tiles/gmna_faults/{z}/{x}/{y}.png', {
    maxZoom: 12,
    detectRetina: true
  });
  gmnaFaults.setZIndex(1000);

  var gmusFaults = L.tileLayer('http://macrostrat.org/tiles/gmus_faults/{z}/{x}/{y}.png', {
    maxZoom: 12,
    detectRetina: true
  });
  gmusFaults.setZIndex(1000);


  var satellite = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jczaplewski.ld2ndl61/{z}/{x}/{y}.png');
  satellite.setZIndex(1);

  // Add the geologic basemap
  var geology = L.tileLayer('http://macrostrat.org/tiles/geologic_new/{z}/{x}/{y}.png', {
    maxZoom: 12,
    opacity: 0.8
  }).addTo(map);

  geology.setZIndex(100);


  // Define our marker out here for ease of adding/removing
  var marker;

  // Custom desaturated icon
  var bwIcon = L.icon({
    iconUrl: 'js/images/marker-icon-bw-2x.png',
    shadowUrl: 'js/images/marker-shadow.png',
    iconSize: [25,41],
    iconAnchor: [12, 41]
  });

  var gmnaTemplate = $('#gmna-template').html();
  Mustache.parse(gmnaTemplate);

  var gmusTemplate = $('#gmus-template').html();
  Mustache.parse(gmusTemplate);

  map.on("click", function(d) {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }

    marker = L.marker(d.latlng, {icon: bwIcon}).addTo(map);


    if (map.getZoom() < 7) {
      // query gmna
      $.getJSON("//macrostrat.org/api/v1/geologic_units?type=gmna&lat=" + d.latlng.lat.toFixed(5) + "&lng=" + d.latlng.lng.toFixed(5), function(data) {
        var rendered = Mustache.render(gmnaTemplate, data.success.data[0]);
        setUnitInfoContent(rendered, d.latlng);

      });
    } else {
      // query gmus
      $.getJSON("//macrostrat.org/api/v1/geologic_units?type=gmus&lat=" + d.latlng.lat.toFixed(5) + "&lng=" + d.latlng.lng.toFixed(5), function(data) {

        if (data.success.data.length < 1) {
          return;
        }
        // Hold unique rocktypes + lithologies
        var rocktypes = [],
            lithologies = [];

        // Find unique rocktypes + lithologies
        data.success.data.forEach(function(d) {
          // Get unique list of rocktypes
          for (var i = 1; i < 4; i++) {
            if (d["rt" + i] && rocktypes.indexOf(d["rt" + i]) < 0) {
              rocktypes.push(d["rt" + i]);
            }
          }

          // Get unique lithologies
          for (var i = 1; i < 6; i++) {
            if (d["lith" + i] && lithologies.indexOf(d["lith" + i]) < 0) {
              lithologies.push(d["lith" + i]);
            }
          }

        });

        var data = data.success.data[0]

        data.rocktypes = (rocktypes) ? rocktypes.join(", ") : null;
        data.lithologies = (lithologies) ? lithologies.join(", ") : null;

        if (data.macro_units && data.macro_units.length > 0) {
          $.getJSON("//macrostrat.org/api/v1/units?response=long&id=" + data.macro_units.join(","), function(response) {
            data.macrodata = processUnits(response.success.data);
            var rendered = Mustache.render(gmusTemplate, data);
            setUnitInfoContent(rendered, d.latlng);
          });
        } else {
          var rendered = Mustache.render(gmusTemplate, data);
          setUnitInfoContent(rendered, d.latlng);
        }

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

  // Show menu
  $("#menu-link").click(function(d) {
    d.preventDefault();
    toggleMenuBar();
  });

  // Make things fast
  var attachFastClick = Origami.fastclick;
  attachFastClick(document.getElementById("not-map"));

  $(".layer-control").click(function(d) {
    d.preventDefault();

    if ($(this).hasClass("disabled")) { 
      return;
    }

    // If it's the adjust control
    if ($(this).hasClass("fa-sliders")) {
      if ($(".opacity-adjuster").css("display") === "none") {
        $(".opacity-adjuster").css("display", "block");
      } else {
        $(".opacity-adjuster").css("display", "none");
      }
    } else {
      // If it's on, turn it off
      if ($(this).hasClass("fa-toggle-on")) {
        $(this).removeClass("fa-toggle-on").addClass("fa-toggle-off");
        switch ($(this).parent().attr("id")) {
          case 'geology' :
            return map.removeLayer(geology);
          case 'gmnaFaults' :
            return removeGmnaFaults();
          case 'gmusFaults' :
            return removeGmusFaults();
          case 'satellite' :
            map.addLayer(stamen);
            map.removeLayer(satellite);
            return;
          default :
            console.log("hmmmm")
        }
      // If it's off, turn it on
      } else {
        $(this).addClass("fa-toggle-on").removeClass("fa-toggle-off");

        switch ($(this).parent().attr("id")) {
          case 'geology' :
            return map.addLayer(geology);
          case 'gmnaFaults' :
            return addGmnaFaults();
          case 'gmusFaults' :
            return addGmusFaults();
          case 'satellite' :
            map.removeLayer(stamen);
            map.addLayer(satellite);
            return;
          default :
            console.log("hmmmm")
        }
      }
    }
  });

  function addGmnaFaults() {
    if (map.hasLayer(gmusFaults)) {
      removeGmusFaults();
    }
    map.addLayer(gmnaFaults);
    $($("#gmnaFaults").children(".layer-control")[0]).addClass("fa-toggle-on");
    $($("#gmnaFaults").children(".layer-control")[0]).removeClass("fa-toggle-off");
  }

  function removeGmnaFaults() {
    map.removeLayer(gmnaFaults);
    $($("#gmnaFaults").children(".layer-control")[0]).removeClass("fa-toggle-on");
    $($("#gmnaFaults").children(".layer-control")[0]).addClass("fa-toggle-off");
  }

  function addGmusFaults() {
    if (map.hasLayer(gmnaFaults)) {
      removeGmnaFaults();
    }
    map.addLayer(gmusFaults);
    $($("#gmusFaults").children(".layer-control")[0]).addClass("fa-toggle-on");
    $($("#gmusFaults").children(".layer-control")[0]).removeClass("fa-toggle-off");
  }

  function removeGmusFaults() {
    map.removeLayer(gmusFaults);
    $($("#gmusFaults").children(".layer-control")[0]).removeClass("fa-toggle-on");
    $($("#gmusFaults").children(".layer-control")[0]).addClass("fa-toggle-off");
  }

  /* Courtesy of the Alligator http://bl.ocks.org/rgdonohue/8465271 */
  $("#geology-opacity-slider")
    .attr({'max': 100, 'min':0, 'step': 10,'value': String(80)})
    .on('input change', function() {
      if (!map.hasLayer(geology)) {
        map.addLayer(geology);
        $(this).parent().siblings(".fa-toggle-off").removeClass("fa-toggle-off").addClass("fa-toggle-on");
      }
      geology.setOpacity(this.value/100);
    });

  // Hide attribution
  $(".attr-container").click(function() {
    $(this).css("visibility", "hidden");
  });

  // Don't close the attribution window when a link is clicked
  $("#attr-info>div>a").click(function(d) {
    d.stopPropagation();
  });
  
  // Removes the marker from the map and hides info bars
  function hideInfoAndMarker() {
    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }
    closeRightBar();
    closeBottomBar();
    closeMenuBar();
  }

  // Update and open the unit info bars
  function setUnitInfoContent(html, ll) {
    document.getElementById("unit_info_bottom").scrollTop = 0;
    document.getElementById("unit_info_right").scrollTop = 0;

    $(".unit_info_content").html(html);

    var maxLength = 200;
    $(".long-text").each(function() {
      if ($(this).html().length > maxLength) {
        var firstBit = $(this).html().substr(0, maxLength),
            secondBit = $(this).html().substr(maxLength, $(this).html().length - maxLength);

        $(this).html("<span>" + firstBit + "</span><span class='ellipsis'>... </span><span class='the-rest'>" + secondBit + "</span><span class='show-more'> >>></span>");
      }
    });

    $(".show-more").click(function(d) {
      if ($(this).siblings(".the-rest").hasClass("view-text")) {
        $(this).html(" >>>");
        $(this).siblings(".ellipsis").removeClass("hidden");
        $(this).siblings(".the-rest").removeClass("view-text");
      } else {
        $(this).html(" <<<");
        $(this).siblings(".ellipsis").addClass("hidden");
        $(this).siblings(".the-rest").addClass("view-text");
      }
    });

    $("#unit_info_right").find(".lt-holder").last().css("padding-bottom", "40px");
    $("#unit_info_bottom").find(".lt-holder").last().css("padding-bottom", "40px");
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
    closeMenuBar();
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
    closeMenuBar();
    $("#unit_info_bottom").addClass("moveDown");
  }
  function closeBottomBar() {
    $("#unit_info_bottom").removeClass("moveDown");
  }


  function toggleMenuBar() {
    if ($("#unit_info_left").hasClass("moveLeft")) {
      closeMenuBar();
    } else {
      openMenuBar();
    }
  }
  function openMenuBar() {
    closeRightBar();
    closeBottomBar();
    $("#unit_info_left").addClass("moveLeft");
  }
  function closeMenuBar() {
    $("#unit_info_left").removeClass("moveLeft");
    $(".opacity-adjuster").css("display", "none");
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

  // Distill the data from many Macrostrat units down into something coherent
  function processUnits(units) {

    return {
      names: units
          .map(function(d) { return d.strat_name })
          .filter(function(item, pos, self) {
              return self.indexOf(item) == pos;
          })
          .join(", "),
      ids: units.map(function(d) { return d.id }).join(", "),
      max_thicks: Math.max.apply(null, units.map(function(d) { return d.max_thick })),
      min_thicks: Math.min.apply(null, units.map(function(d) { return d.min_thick })),
      t_ages: Math.min.apply(null, units.map(function(d) { return d.t_age })),
      b_ages: Math.max.apply(null, units.map(function(d) { return d.b_age })),
      pbdb: Math.max.apply(null, units.map(function(d) { return d.pbdb })),
      uniqueEnvironments: 
        units
          .map(function(d) { return d.environ.split("|").join(", ") })
          .filter(function(item, pos, self) {
              if (item.length > 1) {
                return self.indexOf(item) == pos;
              }
              
          })
          .join(", "),
      uniqueIntervals: function() {
        var min_age = 9999,
            min_age_interval = "",
            max_age = -1,
            max_age_interval = "";

        units.forEach(function(d, i) {
          if (d.t_age < min_age) {
            min_age = d.t_age;
            min_age_interval = d.LO_interval
          }
          if (d.b_age > max_age) {
            max_age = d.b_age;
            max_age_interval = d.FO_interval;
          }
        });
        return (max_age_interval === min_age_interval) ? min_age_interval : max_age_interval + " - " + min_age_interval;
      }
      /*  units
          .map(function(d) { return d.LO_interval + " - " + d.FO_interval })
          .filter(function(item, pos, self) {
              return self.indexOf(item) == pos;
          })
          .join(", ")*/
    }

  }

})();
