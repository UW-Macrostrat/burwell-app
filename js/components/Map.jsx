import React from 'react';
import axios from 'axios';
import Config from './Config.js';

var Map = React.createClass({
  componentDidMount: function() {
    var map = this.map = L.map(this.getDOMNode(), {
      attributionControl: false,
      minZoom: 2
    }).setView([40, -97], 5);

    // If there is a hash location, go there immediately
    if (window.location.hash.length > 3) {
      var hashLocation = L.Hash.parseHash(window.location.hash);
      map.setView(hashLocation.center, hashLocation.zoom);
      this.props.onInteraction('zoom', hashLocation.zoom);
    } else {
      map.setView([40, -97], 5);
    }

    // Make map states linkable
    var hash = new L.Hash(map);

    // Add our basemap
    this.stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
      zIndex: 1
    }).addTo(map);

    // Add the geologic basemap
    this.geology = L.tileLayer('https://dev.macrostrat.org/tiles/geologic_v2/{z}/{x}/{y}.png', {
      maxZoom: 12,
      opacity: 0.8,
      zIndex: 100,
      detectRetina: true
    }).addTo(map);

    this.gmnaFaults = L.tileLayer('http://macrostrat.org/tiles/gmna_faults/{z}/{x}/{y}.png', {
      maxZoom: 12,
      detectRetina: true,
      zIndex: 1000
    });

    this.gmusFaults = L.tileLayer('http://macrostrat.org/tiles/gmus_faults/{z}/{x}/{y}.png', {
      maxZoom: 12,
      detectRetina: true,
      zIndex: 1000
    });

    this.satellite = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jczaplewski.ld2ndl61/{z}/{x}/{y}.png', {
      zIndex: 1
    });


    // Create the marker that will be used when user clicks
    this.marker = L.marker([0, 0], {
      icon: L.icon({
        iconUrl: 'js/images/marker-icon-bw-2x.png',
        shadowUrl: 'js/images/marker-shadow.png',
        iconSize: [25,41],
        iconAnchor: [12, 41]
      })
    });

    // Attach interaction handlers
    map.on('click', this.onClick);
    map.on('zoomstart, movestart', this.onMove);
    map.on('zoomend', this.adjustInterface);
  },

  componentWillUpdate: function(nextProps) {
    // Handle geology
    if (nextProps.data.hasGeology && !(this.map.hasLayer(this.geology))) {
      this.map.addLayer(this.geology);
    } else if (!(nextProps.data.hasGeology) && this.map.hasLayer(this.geology)) {
      this.map.removeLayer(this.geology);
    }

    // Handle GMNA faults
    if (nextProps.data.hasGMNAFaults && !(this.map.hasLayer(this.gmnaFaults))) {
      this.map.addLayer(this.gmnaFaults);
    } else if (!(nextProps.data.hasGMNAFaults) && this.map.hasLayer(this.gmnaFaults)) {
      this.map.removeLayer(this.gmnaFaults);
    }

    // Handle GMUS faults
    if (nextProps.data.hasGMUSFaults && !(this.map.hasLayer(this.gmusFaults))) {
      this.map.addLayer(this.gmusFaults);
    } else if (!(nextProps.data.hasGMUSFaults) && this.map.hasLayer(this.gmusFaults)) {
      this.map.removeLayer(this.gmusFaults);
    }

    // Handle satellite
    if (nextProps.data.hasSatellite && !(this.map.hasLayer(this.satellite))) {
      this.map.addLayer(this.satellite);
      this.map.removeLayer(this.stamen);
    } else if (!(nextProps.data.hasSatellite) && this.map.hasLayer(this.satellite)) {
      this.map.addLayer(this.stamen);
      this.map.removeLayer(this.satellite);
    }

    // Handle geology opacity
    if (nextProps.data.geologyOpacity != this.props.data.geologyOpacity) {
      this.geology.setOpacity(nextProps.data.geologyOpacity/100);
    }
  },

  onClick: function(d) {
    // Set the marker on the click location and add it to the map
    this.marker.setLatLng(d.latlng).addTo(this.map);
    this.props.onInteraction('active', true);
    this.props.onInteraction('articles', {journals: []});

    // Hide the menu
    if (this.props.data.showMenu) {
      this.props.onInteraction('showMenu', false);
    }

    // Jigger the map so that we can open the info display and still show the marker
    if (window.innerHeight > window.innerWidth) {
      this.map.panToOffset(d.latlng, [ 0, -((window.innerHeight*0.6)/2) ]);
    } else {
      this.map.panToOffset(d.latlng, [ -((window.innerWidth*0.6)/2), 0 ]);
    }

    // Fetch data depending on zoom level
    if (this.map.getZoom() < 7) {
      this.getGMNA(d.latlng);
    } else {
      this.getGMUS(d.latlng);
    }
  },

  onMove: function() {
    if (this.map.hasLayer(this.marker)) {
      this.map.removeLayer(this.marker);
      this.props.onInteraction('active', false);
    }
    if (this.props.data.showMenu) {
      this.props.onInteraction('showMenu', false);
    }
  },

  adjustInterface: function() {
    this.props.onInteraction('zoom', this.map.getZoom());
  },

  getGMNA: function(latlng) {
    axios.get(Config.apiUrl + '/geologic_units/gmna', {
      params: {
        lat: latlng.lat.toFixed(5),
        lng: latlng.lng.toFixed(5)
      }
    })
    .then(function(response) {
      if (response.data.success.data.length) {
        this.props.onInteraction('gmna', response.data.success.data[0]);
      }
    }.bind(this));
  },

  getGMUS: function(latlng) {
    axios.get(Config.apiUrl + '/geologic_units/gmus', {
      params: {
        lat: latlng.lat.toFixed(5),
        lng: latlng.lng.toFixed(5)
      }
    })
    .then(function(response) {
      if (response.data.success.data.length) {
        this.props.onInteraction('gmus', response.data.success.data[0]);

        if (response.data.success.data[0].macro_units.length) {
          this.getMacrostrat(response.data.success.data[0].macro_units);
        } else {
          this.props.onInteraction('macrostrat', {
            names: [],
            ids: []
          });
        }
      }
    }.bind(this));
  },

  getMacrostrat: function(unit_ids) {
    axios.get(Config.apiUrl + '/units', {
      params: {
        response: 'long',
        unit_id: unit_ids.join(',')
      }
    })
    .then(function(response) {
      if (response.data.success.data.length) {
        // Summarize the data
        var unitSummary = {
          names: response.data.success.data.map(function(d) {
            if (d.Mbr) {
              return d.Mbr + " Member";
            } else if (d.Fm) {
              return d.Fm + " Formation";
            } else if (d.Gp) {
              return d.Gp + " Group";
            } else if (d.SGp) {
              return d.SGp + " Supergroup"
            }
          }).filter(function(name, idx, names) { return names.indexOf(name) === idx; }),
          ids: response.data.success.data.map(function(d) { return d.unit_id }),
          max_thick: Math.max.apply(null, response.data.success.data.map(function(d) { return d.max_thick; })),
          min_thick: Math.min.apply(null, response.data.success.data.map(function(d) { return d.min_thick; })),
          b_age: Math.max.apply(null, response.data.success.data.map(function(d) { return d.b_age; })),
          t_age: Math.min.apply(null, response.data.success.data.map(function(d) { return d.t_age; })),
          pbdb_collections: response.data.success.data.map(function(d) { return d.pbdb_collections; }).reduce(function(total, each) { return total + each }, 0),
          uniqueIntervals: (function() {
            var min_age = 9999,
                min_age_interval = "",
                max_age = -1,
                max_age_interval = "";

            response.data.success.data.forEach(function(d, i) {
              if (d.t_age < min_age) {
                min_age = d.t_age;
                min_age_interval = d.t_int_name;
              }
              if (d.b_age > max_age) {
                max_age = d.b_age;
                max_age_interval = d.b_int_name;
              }
            });
            return (max_age_interval === min_age_interval) ? min_age_interval : max_age_interval + " - " + min_age_interval;
          })()
        }

        if (unitSummary.names.length) {
          this.getArticles(unitSummary.names);
        }

        this.props.onInteraction('macrostrat', unitSummary);
      }
    }.bind(this));
  },

  getArticles: function(strat_names) {
    axios.get('https://dev.macrostrat.org/mdd/api/v1/articles', {
      params: {
        q: strat_names.join(',')
      }
    })
    .then(function(response) {
      var data = response.data.results.results;

      var parsed = {
        journals: []
      };

      for (var i = 0; i < data.length; i++) {
        var found = false;
        for (var j = 0; j < parsed.journals.length; j++) {
          if (parsed.journals[j].name === data[i].fields.pubname[0]) {
            parsed.journals[j].articles.push(data[i]);
            found = true;
          }
        }

        if (!found) {
          parsed.journals.push({
            name: data[i].fields.pubname[0],
            articles: [data[i]]
          });
        }
      }
      
      this.props.onInteraction('articles', parsed);
    }.bind(this));
  },

  render: function() {
    return <div id='map'></div>
  }
});

export default Map;
