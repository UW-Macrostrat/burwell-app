import React from 'react';
import Map from './Map.js';
import xhr from 'xhr';
import Config from './Config';

import Attribution from './Attribution';
import Search from './Search';
import BurwellReference from './BurwellReference';
import Menu from './Menu';
import InfoPanel from './InfoPanel';
import MenuToggle from './MenuToggle';

var App = React.createClass({
  getInitialState: function() {
      return {
        sources: {},
        scales: {},
        showAttribution: false,
        showSearch: false,
        showSource: false,
        showMenu: false,
        active: false,
        searchCoords: [0,0],
        lat: null,
        lng: null,
        zoom: 0,
        hasGeology: false,
        geologyOpacity: 80,
        hasSatellite: true,
        hasBurwell: true,
        burwellOpacity: 60,
        macrostrat: {
          names: [],
          strat_names: [{id: null, name:null}],
          rank_names: [],
          ids: []
        },
        articles: {
         journals: []
       },
       burwell: [],
       currentSource: {
         source_id: null,
         name: '',
         url: '',
         ref_title: '',
         authors: '',
         ref_year: '',
         ref_source: '',
         isbn_doi: ''
       },
       locate: null
      }
  },

  updateState: function(prop, data) {
    if (typeof(prop) === 'string') {
      this.setState({ [prop] : data });
    } else {
      this.setState(prop);
    }

  },

  componentWillMount() {
    xhr({
      uri: `${Config.apiUrl}/defs/sources?all`
    }, function(error, response, body) {
      var data = JSON.parse(body);

      if (data.success.data.length) {
        var mappedSources = {};
        var mappedScales = {};
        for (var i = 0; i < data.success.data.length; i++) {
          mappedSources[data.success.data[i].source_id] = data.success.data[i];
          mappedScales[data.success.data[i].source_id] = data.success.data[i].scale;
        }

        this.setState({
          sources: mappedSources,
          scales: mappedScales
        });
      }
    }.bind(this))
  },

  render: function() {
    return (
      <div className='container'>
        <Map
          data={this.state}
          shareState={this.updateState}
          locate={function(l) {
            this.setState({locate: l});
          }.bind(this)}
          updateView={function(l) {
            this.setState({updateView: l})
          }.bind(this)}
          scales={this.state.scales}
        />


        <Attribution
          data={this.state}
          shareState={this.updateState}
        />

        <Search
          data={this.state}
          shareState={this.updateState}
          updateView={this.state.updateView}
        />

        <BurwellReference
          data={this.state}
          shareState={this.updateState}
        />

        <Menu
          data={this.state}
          shareState={this.updateState}
        />

        <InfoPanel
          data={this.state}
          shareState={this.updateState}
          sources={this.state.sources}
        />

        <MenuToggle
          shareState={this.updateState}
          locate={this.state.locate}
        />

      </div>
    );
  }
});

export default App;

console.log('Looking for the code? Find it here - https://github.com/UW-Macrostrat/burwell-app');
