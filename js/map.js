(function() {
  var apiUrl = (window.location.hostname === "localhost") ? "http://localhost:5000" : window.location.origin,
      tileUrl = (window.location.hostname === "localhost") ? "https://dev.macrostrat.org" : window.location.origin;

  var map = L.map('map', {
    // We have a different attribution control...
    attributionControl: false,
    minZoom: 2
  });

  // If there is a hash location, go there immediately
  if (window.location.hash.length > 3) {
    var hashLocation = L.Hash.parseHash(window.location.hash);
    map.setView(hashLocation.center, hashLocation.zoom);
  } else {
    map.setView([40, -97], 5);
  }

  // Make map states linkable
  var hash = new L.Hash(map);

  // Add our basemap
  var stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
    zIndex: 1
  }).addTo(map);

  var gmnaFaults = L.tileLayer('http://macrostrat.org/tiles/gmna_faults/{z}/{x}/{y}.png', {
    maxZoom: 12,
    detectRetina: true,
    zIndex: 1000
  });

  var gmusFaults = L.tileLayer('http://macrostrat.org/tiles/gmus_faults/{z}/{x}/{y}.png', {
    maxZoom: 12,
    detectRetina: true,
    zIndex: 1000
  });

  var satellite = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jczaplewski.ld2ndl61/{z}/{x}/{y}.png', {
    zIndex: 1
  });

  // Add the geologic basemap
  var geology = L.tileLayer(tileUrl + '/tiles/geologic_v2/{z}/{x}/{y}.png', {
    maxZoom: 12,
    opacity: 0.8,
    zIndex: 100
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

  var gmnaTemplate = $('#gmna-template').html();
  Mustache.parse(gmnaTemplate);

  var gmusTemplate = $('#gmus-template').html();
  Mustache.parse(gmusTemplate);

  var ddTemplate = $('#dd-template').html();
  Mustache.parse(ddTemplate);

  map.on("click", function(d) {

    // Clean up DD results
    $(".dd_content").html("");

    if (map.hasLayer(marker)) {
      map.removeLayer(marker);
    }

    marker = L.marker(d.latlng, {icon: bwIcon}).addTo(map);


    if (map.getZoom() < 7) {
      // query gmna
      $.getJSON(apiUrl + "/api/v1/geologic_units?type=gmna&lat=" + d.latlng.lat.toFixed(5) + "&lng=" + d.latlng.lng.toFixed(5), function(data) {
        data = data.success.data[0];

        data.ages = (data.min_age === data.max_age) ? data.min_age : data.max_age + " - " + data.min_age;
        data.age_bottom = parseFloat(data.age_bottom);
        data.age_top = parseFloat(data.age_top);

        var rendered = Mustache.render(gmnaTemplate, data);
        setUnitInfoContent(rendered, d.latlng);

      });
    } else {
      // query gmus
      $.getJSON(apiUrl + "/api/v1/geologic_units?type=gmus&lat=" + d.latlng.lat.toFixed(5) + "&lng=" + d.latlng.lng.toFixed(5), function(data) {

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

        data = data.success.data[0];
        data.age_bottom = parseFloat(data.age_bottom);
        data.age_top = parseFloat(data.age_top);
        data.rocktypes = (rocktypes) ? rocktypes.join(", ") : null;
        data.lithologies = (lithologies) ? lithologies.join(", ") : null;
        data.ages = (data.min_age === data.max_age) ? data.min_age : data.max_age + " - " + data.min_age;

        if (data.macro_units && data.macro_units.length > 0) {
          $.getJSON(apiUrl + "/api/v1/units?response=long&id=" + data.macro_units.join(","), function(response) {
            data.macrodata = processUnits(response.success.data);
            var rendered = Mustache.render(gmusTemplate, data);
            setUnitInfoContent(rendered, d.latlng);

            var stratNames = [];

            response.success.data.forEach(function(d) {
              if (stratNames.indexOf(d.strat_name) < 0) {
                stratNames.push(d.strat_name);
              }
            });

            if (stratNames.length > 0) {
              $.getJSON("//dev.macrostrat.org/mdd/" + stratNames.join("*"), function(res) {
                if (res.results.length > 0) {
                  var parsed = {
                    journals: []
                  };

                  res.results.forEach(function(d) {
                    var found = false;
                    d.fields.scidirect = "http://www.sciencedirect.com/science/article/pii/" + (d.fields.URL[0].split("/")[d.fields.URL[0].split("/").length - 1]);

                    parsed.journals.forEach(function(j) {
                      if (j.name === d.fields.pubname[0]) {
                        j.articles.push(d);
                        found = true;
                      }
                    });
                    if (!found) {
                      parsed.journals.push({
                        name: d.fields.pubname[0],
                        articles: [d]
                      });
                    }
                  });

                  var ddRendered = Mustache.render(ddTemplate, parsed);
                  $(".dd_content").html(ddRendered);

                  $(".show-content").on("click", function(d) {
                    if ($(this).hasClass("fa-plus-square-o")) {
                      $(this).parent(".dd-article-heading").next(".dd-text").css("display", "block");
                      $(this).removeClass("fa-plus-square-o");
                      $(this).addClass("fa-minus-square-o");
                    } else {
                      $(this).parent(".dd-article-heading").next(".dd-text").css("display", "none");
                      $(this).removeClass("fa-minus-square-o");
                      $(this).addClass("fa-plus-square-o");
                    }
                  });
                }
              });
            }
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

  // Hide things if the <esc> key is pressed
  $(document).on("keyup", function(e) {
    if (e.keyCode === 27) {
      closeRightBar();
      closeBottomBar();
      closeMenuBar();
      $(".attr-container").css("visibility", "hidden");
    }
  });

  // Show attribution
  $(".info-link").click(function(d) {
    d.preventDefault();
    $(".attr-container").css("visibility", "visible");
  });

  // Show menu
  $(".menu-link").click(function(d) {
    d.preventDefault();
    toggleMenuBar();
  });

  // Handle interaction with layers
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
            console.log("hmmmm");
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
            console.log("hmmmm");
        }
      }
    }
  });
  

  // And finally, make things fast
  var attachFastClick = Origami.fastclick;
  attachFastClick(document.getElementsByClassName("not-map")[0]);


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
    // Make sure they are scrolled to the top
    document.getElementById("unit_info_bottom").scrollTop = 0;
    document.getElementById("unit_info_right").scrollTop = 0;

    // Update the content
    $(".unit_info_content").html(html);

    var maxLength = 200;

    // If the text is long, hide everything after 200 characters
    $(".long-text").each(function() {
      if ($(this).html().length > maxLength && $(this).html().length - maxLength > 50) {
        var firstBit = $(this).html().substr(0, maxLength),
            secondBit = $(this).html().substr(maxLength, $(this).html().length - maxLength);

        $(this).html("<span>" + firstBit + "</span><span class='ellipsis'>... </span><span class='the-rest'>" + secondBit + "</span><span class='show-more'> >>></span>");
      }
    });

    // Show everything after 200 characters on click
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

    // Space things out
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

    return this.setView(point, this._zoom, { pan: opts });
  };

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
          .map(function(d) { return "<a target='_blank' href='//dev.macrostrat.org/sift/info/?strat_id=" + d.strat_name_id + "'>" + d.strat_name + "</a>"; })
          .filter(function(item, pos, self) {
              return self.indexOf(item) == pos;
          })
          .join(", "),

      ids: units.map(function(d) { return "<a target='_blank' href='//dev.macrostrat.org/sift/info/?unit_id=" + d.id + "'>" + d.id + "</a>"; }).join(", "),
      max_thicks: Math.max.apply(null, units.map(function(d) { return d.max_thick; })),
      min_thicks: Math.min.apply(null, units.map(function(d) { return d.min_thick; })),
      t_ages: Math.min.apply(null, units.map(function(d) { return d.t_age; })),
      b_ages: Math.max.apply(null, units.map(function(d) { return d.b_age; })),
      pbdb: Math.max.apply(null, units.map(function(d) { return d.pbdb; })),

      uniqueEnvironments: 
        units
          .map(function(d) { return d.environ.split("|").join(", "); })
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
            min_age_interval = d.LO_interval;
          }
          if (d.b_age > max_age) {
            max_age = d.b_age;
            max_age_interval = d.FO_interval;
          }
        });
        return (max_age_interval === min_age_interval) ? min_age_interval : max_age_interval + " - " + min_age_interval;
      }
    };
  }

})();
