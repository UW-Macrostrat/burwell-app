import React from 'react';
import Map from './Map.jsx';
import AttributionControl from './AttributionControl.jsx';
import Attribution from './Attribution.jsx';
import MenuControl from './MenuControl.jsx';
import Menu from './Menu.jsx';
import InfoPanel from './InfoPanel.jsx';

var App = React.createClass({
  getInitialState: function() {
      return {
        showAttribution: false,
        showMenu: false,
        active: false,
        lat: -1,
        lng: -1,
        zoom: 0,
        hasGeology: true,
        geologyOpacity: 80,
        hasGMNAFaults: false,
        hasGMUSFaults: false,
        hasSatellite: false,
        gmna: {},
        gmus: {
          rocktype: [],
          lithology: []
        },
        macrostrat: {
          names: [],
          ids: []
        },
        articles: {
         journals: []
       }
      }
  },

  updateState: function(prop, data) {
    // Do this so we can have a generic state update method
    var updatedProp = (function() {
      var obj = {};
      obj[prop] = data;
      return obj;
    })();

    // If using ES6, I can do this instead:
    // this.setState({ [prop] : data })

    this.setState(updatedProp);
  },

  render: function() {
    return (
      <div className='container'>
        <Map
          data={this.state}
          onInteraction={this.updateState}
        />

        <AttributionControl
          onInteraction={this.updateState}
        />
        <Attribution
          data={this.state}
          onInteraction={this.updateState}
        />

        <MenuControl
          onInteraction={this.updateState}
        />
        <Menu
          data={this.state}
          onInteraction={this.updateState}
        />

        <InfoPanel
          data={this.state}
          onInteraction={this.updateState}
        />

      </div>
    );
  }
});

export default App;
