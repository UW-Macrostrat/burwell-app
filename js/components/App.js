import React from 'react';
import Map from './Map.jsx';
import xhr from 'xhr';
import Config from './Config.js';

import Attribution from './Attribution.jsx';

import Menu from './Menu.jsx';
import InfoPanel from './InfoPanel.jsx';
import MenuToggle from './MenuToggle.jsx';

var App = React.createClass({
  getInitialState: function() {
      return {
        sources: {},
        scales: {},
        showAttribution: false,
        showMenu: false,
        active: false,
        lat: -1,
        lng: -1,
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
          ids: []
        },
        articles: {
         journals: []
       },
       burwell: [],
       locate: null
      }
  },

  updateState: function(prop, data) {
    // Do this so we can have a generic state update method
    /*var updatedProp = (function() {
      var obj = {};
      obj[prop] = data;
      return obj;
    })();
*/
    // If using ES6, I can do this instead:
     this.setState({ [prop] : data })

    //this.setState(updatedProp);
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
          scales={this.state.scales}
        />


        <Attribution
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
