import React from 'react';
import xhr from 'xhr';
import async from 'async';
import Config from './Config.js';

var Map = React.createClass({
  getInitialState: function() {
    return {
      requests: {
        gmna: null,
        gmus: null,
        macrostrat: null,
        articles: null,
        burwell: null
      },
      geologyWasVisible: true
    }
  },

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

    this.burwell = L.tileLayer('https://dev.macrostrat.org/tiles/burwell/{z}/{x}/{y}.png', {
      maxZoom: 12,
      opacity: 0.8,
      zIndex: 100,
      detectRetina: true
    });

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
      this.setState({'geologyWasVisible': true});
      this.props.onInteraction('hasGeology', true);
    } else if (!(nextProps.data.hasGeology) && this.map.hasLayer(this.geology)) {
      this.map.removeLayer(this.geology);
      this.setState({'geologyWasVisible': false});
      this.props.onInteraction('hasGeology', false);
    }

    // Handle burwell
    if (nextProps.data.hasBurwell && !(this.map.hasLayer(this.burwell))) {
      this.map.addLayer(this.burwell);
      this.props.onInteraction('hasBurwell', true);

      if (this.map.hasLayer(this.geology)) {
        this.setState({'geologyWasVisible': true });
        this.map.removeLayer(this.geology);
        this.props.onInteraction('hasGeology', false);
      }

    } else if (!(nextProps.data.hasBurwell) && this.map.hasLayer(this.burwell)) {
      this.map.removeLayer(this.burwell);
      this.props.onInteraction('hasGeology', false);

      if (this.state.geologyWasVisible) {
        this.map.addLayer(this.geology);
        this.props.onInteraction('hasGeology', true);
      }
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
    this.props.onInteraction('macrostrat', {
      names: [],
      ids: []
    });
    this.props.onInteraction('gmna', {})
    this.props.onInteraction('gmus', {
      rocktype: [],
      lithology: []
    });
    this.props.onInteraction('burwell', []);

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
    (this.props.data.zoom >= 7 && (this.props.data.hasGeology || (!(this.props.data.hasGeology) && !(this.props.data.hasBurwell))))
    // Fetch data depending on zoom level
    if (this.props.data.hasBurwell) {
      if (this.map.getZoom() < 6) {
        this.getBurwell(d.latlng, 'small');
      } else if (this.map.getZoom() >= 6 && this.map.getZoom() < 10) {
        this.getBurwell(d.latlng, 'medium');
      } else {
        this.getBurwell(d.latlng, 'large');
      }
    } else if (this.map.getZoom() < 7 && (this.props.data.hasGeology || (!(this.props.data.hasGeology) && !(this.props.data.hasBurwell)))) {
      this.getGMNA(d.latlng);
    } else if (this.map.getZoom() >= 7 && (this.props.data.hasGeology || (!(this.props.data.hasGeology) && !(this.props.data.hasBurwell)))){
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
    if (this.state.requests.gmna && this.state.requests.gmna.readyState != 4) {
      this.state.requests.gmna.abort();
    }

    this.state.requests.gmna = xhr({
      uri: `${Config.apiUrl}/geologic_units/gmna?lat=${latlng.lat.toFixed(5)}&lng=${latlng.lng.toFixed(5)}`
    }, function(error, response, body) {
      var data = JSON.parse(body);
      if (data.success.data.length) {
        this.props.onInteraction('gmna', data.success.data[0]);
      }
    }.bind(this));
  },

  getGMUS: function(latlng) {
    if (this.state.requests.gmus && this.state.requests.gmus.readyState != 4) {
      this.state.requests.gmus.abort();
    }

    this.state.requests.gmus = xhr({
      uri: `${Config.apiUrl}/geologic_units/gmus?lat=${latlng.lat.toFixed(5)}&lng=${latlng.lng.toFixed(5)}`
    }, function(error, response, body) {
      var data = JSON.parse(body);
      if (data.success.data.length) {
        this.props.onInteraction('gmus', data.success.data[0]);
        var foo = this.props;
        if (data.success.data[0].macro_units.length) {
          this.getMacrostrat(data.success.data[0].macro_units, function(unitSummary) {
            foo.onInteraction('macrostrat', unitSummary);
          }.bind(this));
        }
      }
    }.bind(this));
  },

  getBurwell: function(latlng, scale) {
    if (this.state.requests.burwell && this.state.requests.burwell.readyState != 4) {
      this.state.requests.burwell.abort();
    }

    this.state.requests.burwell = xhr({
      uri: `${Config.apiUrl}/geologic_units/burwell?lat=${latlng.lat.toFixed(5)}&lng=${latlng.lng.toFixed(5)}&scale=${scale}`
    }, function(error, response, body) {
      var data = JSON.parse(body);
      if (data.success.data.length) {
        async.eachLimit(data.success.data, 1, function(d, callback) {
          if (d.macro_units.length) {
            this.getMacrostrat(d.macro_units, function(unitSummary) {
              d.macrostrat = unitSummary;
              callback(null);
            });
          } else {
            callback(null);
          }
        }.bind(this), function(error) {
          this.props.onInteraction('burwell', data.success.data);
        }.bind(this));
      }
    }.bind(this));
  },

  getMacrostrat: function(unit_ids, callback) {
    if (this.state.requests.macrostrat && this.state.requests.macrostrat.readyState != 4) {
      this.state.requests.macrostrat.abort();
    }

    this.state.requests.macrostrat = xhr({
      uri: `${Config.apiUrl}/units?response=long&unit_id=${unit_ids.join(',')}`
    }, function(error, response, body) {
      var data = JSON.parse(body);
      if (data.success.data.length) {
        // Summarize the data
        var unitSummary = {
          names: data.success.data.map(function(d) {
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
          ids: data.success.data.map(function(d) { return d.unit_id }),
          max_thick: Math.max.apply(null, data.success.data.map(function(d) { return d.max_thick; })),
          min_thick: Math.min.apply(null, data.success.data.map(function(d) { return d.min_thick; })),
          b_age: Math.max.apply(null, data.success.data.map(function(d) { return d.b_age; })),
          t_age: Math.min.apply(null, data.success.data.map(function(d) { return d.t_age; })),
          pbdb_collections: data.success.data.map(function(d) { return d.pbdb_collections; }).reduce(function(total, each) { return total + each }, 0),
          uniqueIntervals: (function() {
            var min_age = 9999,
                min_age_interval = "",
                max_age = -1,
                max_age_interval = "";

            data.success.data.forEach(function(d, i) {
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

        callback(unitSummary);
      } else {
        callback({
          names: [],
          ids: []
        });
      }
    }.bind(this));
  },

  getArticles: function(strat_names) {
    if (this.state.requests.articles && this.state.requests.articles.readyState != 4) {
      this.state.requests.articles.abort();
    }

    this.state.requests.articles = xhr({
      uri: `https://dev.macrostrat.org/mdd/api/v1/articles?q=${strat_names.join(',')}`
    }, function(error, response, body) {
      var data;
      if (body) {
        data = JSON.parse(response.body).results.results;
      } else {
        data = []
      }


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
