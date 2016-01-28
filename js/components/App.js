import React from 'react';
import Map from './Map.jsx';
import xhr from 'xhr';
import Config from './Config.js';

import Attribution from './Attribution.jsx';
import Search from './Search';
import BurwellReference from './BurwellReference.jsx';
import Menu from './Menu.jsx';
import InfoPanel from './InfoPanel.jsx';
import MenuToggle from './MenuToggle.jsx';

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
        hasGMNAFaults: false,
        hasGMUSFaults: false,
        hasSatellite: true,
        hasBurwell: true,
        burwellOpacity: 60,
        gmna: {},
        gmus: {
          rocktype: [],
          lithology: []
        },
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
          onInteraction={this.updateState}
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
          onInteraction={this.updateState}
        />

        <Search
          data={this.state}
          onInteraction={this.updateState}
          updateView={this.state.updateView}
        />

        <BurwellReference
          data={this.state}
          onInteraction={this.updateState}
        />

        <Menu
          data={this.state}
          onInteraction={this.updateState}
        />

        <InfoPanel
          data={this.state}
          onInteraction={this.updateState}
          sources={this.state.sources}
        />

        <MenuToggle
          onInteraction={this.updateState}
          locate={this.state.locate}
        />

      </div>
    );
  }
});

export default App;

console.log('Looking for the code? Find it here - https://github.com/UW-Macrostrat/gmna-app');
