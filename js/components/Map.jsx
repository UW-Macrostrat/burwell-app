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
      }
    }
  },

  locate: function() {
    this.map.locate();
  },

  componentDidMount: function() {
    var map = this.map = L.map(this.getDOMNode(), {
      attributionControl: false,
      minZoom: 1
    }).setView([40.8, -94.1], 3);

    // If there is a hash location, go there immediately
    if (window.location.hash.length > 3) {
      var hashLocation = L.Hash.parseHash(window.location.hash);
      map.setView(hashLocation.center, hashLocation.zoom);
      this.props.onInteraction('zoom', hashLocation.zoom);
    }

    // Make map states linkable
    var hash = new L.Hash(map);

    // Add our basemap
    this.stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
      zIndex: 1
    });

    this.burwell = L.tileLayer(Config.apiUrl + '/maps/burwell/{z}/{x}/{y}/tile.png', {
      maxZoom: 13,
      opacity: 0.4,
      zIndex: 100
      //detectRetina: true
    }).addTo(map);

    this.gmnaFaults = L.tileLayer('https://macrostrat.org/tiles/gmna_faults/{z}/{x}/{y}.png', {
      maxZoom: 12,
      detectRetina: true,
      zIndex: 1000
    });

    this.gmusFaults = L.tileLayer('https://macrostrat.org/tiles/gmus_faults/{z}/{x}/{y}.png', {
      maxZoom: 12,
      detectRetina: true,
      zIndex: 1000
    });

    this.satellite = L.tileLayer('https://{s}.tiles.mapbox.com/v3/jczaplewski.ld2ndl61/{z}/{x}/{y}.png', {
      zIndex: 1,
      maxZoom: 14
    }).addTo(map);


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

    map.on('locationfound', (event) => {
      map.setView(event.latlng, 11);
      this.onClick(event);
    });

    this.props.locate(this.locate);
  },

  componentWillUpdate: function(nextProps) {

    // Handle burwell
    if (nextProps.data.hasBurwell && !(this.map.hasLayer(this.burwell))) {
      this.map.addLayer(this.burwell);
      this.props.onInteraction('hasBurwell', true);

    } else if (!(nextProps.data.hasBurwell) && this.map.hasLayer(this.burwell)) {
      this.map.removeLayer(this.burwell);
      this.props.onInteraction('hasGeology', false);
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

    // Handle burwell opacity
    if (nextProps.data.burwellOpacity != this.props.data.burwellOpacity) {
      this.burwell.setOpacity(nextProps.data.burwellOpacity/100);
    }
  },

  onClick: function(d) {
    // Set the marker on the click location and add it to the map
    this.marker.setLatLng(d.latlng).addTo(this.map);
    this.props.onInteraction({
      lat: d.latlng.lat,
      lng: d.latlng.lng,
      active: true,
      burwell: [],
      articles: {journals: []},
      macrostrat: {
        names: [],
        strat_names: [{id: null, name: null}],
        rank_names: [],
        ids: []
      },
      showMenu: false
    });

    // Abort pending requests so that interface stays consistent
    if (this.state.requests.articles && this.state.requests.articles.readyState != 4) {
      this.state.requests.articles.abort();
    }
    if (this.state.requests.macrostrat && this.state.requests.macrostrat.readyState != 4) {
      this.state.requests.macrostrat.abort();
    }
    if (this.state.requests.burwell && this.state.requests.burwell.readyState != 4) {
      this.state.requests.burwell.abort();
    }

    // Jigger the map so that we can open the info display and still show the marker
    if (window.innerHeight < window.innerWidth) {
      this.map.panToOffset(d.latlng, [ -((window.innerWidth*0.6)/2), 0 ]);
    }

    // Fetch data
    this.getBurwell(d.latlng);

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

  getBurwell: function(latlng) {
    var scaleLookup = {
      0: 'tiny',
      1: 'tiny',
      2: 'tiny',
      3: 'tiny',
      4: 'small',
      5: 'small',
      6: 'medium',
      7: 'medium',
      8: 'medium',
      9: 'medium',
      10: 'medium',
      11: 'large',
      12: 'large',
      13: 'large',
      14: 'large'
    }

    var priorities = {
      'tiny': ['tiny', 'small', 'medium', 'large'],
      'small': ['small', 'medium', 'large', 'tiny'],
      'medium': ['medium', 'large', 'small', 'tiny'],
      'large': ['large', 'medium', 'small', 'tiny']
    }


    this.state.requests.burwell = xhr({
      uri: `${Config.apiUrl}/geologic_units/burwell?lat=${latlng.lat.toFixed(5)}&lng=${latlng.lng.toFixed(5)}`
    }, (error, response, body) => {
      var data = JSON.parse(body);
      if (data.success.data.length) {
        // Find which scale we should use
        var currentScale = scaleLookup[this.props.data.zoom];
        var returnedScales = data.success.data.map(d => { return this.props.scales[d.source_id] });

        var targetScales = [];

        for (var i = 0; i < priorities[currentScale].length; i++) {
          if (returnedScales.indexOf(priorities[currentScale][i]) > -1) {
            targetScales.push(priorities[currentScale][i]);
            if (currentScale != 'tiny' && currentScale != 'small') {
              break;
            } else if (targetScales.length > 1) {
              break;
            }
          }
        }

        var bestFit = data.success.data.filter(d => {
          if (targetScales.indexOf(this.props.scales[d.source_id]) > -1) {
            return d;
          }
        });

        var macroUnits = [].concat.apply([], bestFit.map(unit => { return unit.macro_units }));
        var stratNames = [].concat.apply([], bestFit.map(unit => { return unit.strat_names }));

        if (macroUnits.length) {
          this.getMacrostrat(macroUnits, stratNames, unitSummary => {
            if (unitSummary.rank_names.length) {
              this.getArticles(unitSummary.rank_names);
            }
            this.props.onInteraction({
              burwell: bestFit,
              macrostrat: unitSummary
            });

          });
        } else {
          this.props.onInteraction({
            burwell: bestFit
          });
        }

        // Hack to get articles for Australia medium in the absence of Macrostrat matches
        bestFit.forEach(unit => {
          if (unit.source_id === 5 && unit.strat_name.length) {
            this.getArticles([unit.strat_name]);
          }
        });

      }
    });
  },

  getMacrostrat: function(unit_ids, strat_names, callback) {
    this.state.requests.macrostrat = xhr({
      uri: `${Config.apiUrl}/units?response=long&unit_id=${unit_ids.join(',')}`
    }, (error, response, body) => {
      var data = JSON.parse(body);
      if (data.success.data.length) {

        var allStratNames = data.success.data.map(function(d) {
          return {
            name: d.strat_name_long,
            id: d.strat_name_id
          }
        });
        var s = {}

        var filteredStratNames = allStratNames.filter(function(d) {
          if (strat_names.indexOf(d.id) > -1 && !s[d.id]) {
            s[d.id] = d;
            return d;
          }
        });

        // Summarize the data
        var unitSummary = {
          strat_names: filteredStratNames,
          rank_names: data.success.data.map(function(d) { return d.strat_name_long }),
          ids: data.success.data.map(function(d) { return d.unit_id }),
          max_thick: Math.max.apply(null, data.success.data.map(function(d) { return d.max_thick; })),
          min_thick: Math.min.apply(null, data.success.data.map(function(d) { return d.min_thick; })),
          b_age: Math.max.apply(null, data.success.data.map(function(d) { return d.b_age; })),
          t_age: Math.min.apply(null, data.success.data.map(function(d) { return d.t_age; })),
          pbdb_collections: data.success.data.map(function(d) { return d.pbdb_collections; }).reduce(function(total, each) { return total + each }, 0),
          uniqueIntervals: (function() {
            var min_age = 9999,
                min_age_interval = '',
                max_age = -1,
                max_age_interval = '';

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
            return (max_age_interval === min_age_interval) ? min_age_interval : max_age_interval + ' - ' + min_age_interval;
          })()
        }



        callback(unitSummary);
      } else {
        callback({
          names: [],
          ids: []
        });
      }
    });
  },

  getArticles: function(strat_names) {
    this.state.requests.articles = xhr({
      uri: `${Config.geodeepdiveURL}/snippets?term=${strat_names.join(',')}`
    }, (error, response, body) => {
      var data;
      if (body) {
        data = JSON.parse(response.body);
        if (data.error) {
          data = []
        } else {
          data = data.success.data
        }
      } else {
        data = []
      }

      var parsed = {
        journals: []
      };

      for (var i = 0; i < data.length; i++) {
        var found = false;
        for (var j = 0; j < parsed.journals.length; j++) {
          if (parsed.journals[j].name === data[i].pubname) {
            parsed.journals[j].articles.push(data[i]);
            found = true;
          }
        }

        if (!found) {
          parsed.journals.push({
            name: data[i].pubname,
            source: data[i].source,
            articles: [data[i]]
          });
        }
      }

      this.props.onInteraction('articles', parsed);

    });

  },

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data.zoom != this.props.data.zoom) {
      return false;
    } else {
      return true;
    }
  },

  render: function() {
  //  console.log('map render');
    return <div id='map'></div>
  }
});

export default Map;
