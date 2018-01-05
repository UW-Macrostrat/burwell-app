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

import ElevationChart from './ElevationChart'

var App = React.createClass({
  getInitialState: function() {
      return {
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
        hasBurwell: false,
        hasEmphasized: true,
        burwellOpacity: 60,
        emphasizedOpacity: 60,
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
       lines: {
         name: '',
         type: '',
         direction: '',
         descrip: '',
         ref: {}
       },
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
       locate: null,
       showElevation: false,
       selectElevation: false,
       loadingElevation: false,
       elevationData: [],
       activeElevationPoint: []
      }
  },

  updateState: function(prop, data) {
    if (typeof(prop) === 'string') {
      this.setState({ [prop] : data });
    } else {
      this.setState(prop);
    }

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
          fitBounds={function(l) {
            this.setState({fitBounds: l})
          }.bind(this)}
        />


        <Attribution
          data={this.state}
          shareState={this.updateState}
        />

        <Search
          data={this.state}
          shareState={this.updateState}
          updateView={this.state.updateView}
          fitBounds={this.state.fitBounds}
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
        />

        <MenuToggle
          shareState={this.updateState}
          locate={this.state.locate}
        />

      <ElevationChart
        shareState={this.updateState}
        data={this.state}
      />

      </div>
    );
  }
});

export default App;

console.log('Looking for the code? Find it here - https://github.com/UW-Macrostrat/burwell-app');
