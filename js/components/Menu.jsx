import React from 'react';

var Menu = React.createClass({
  getInitialState: function() {
    return {
      showOpacity: false,
      showOpacityBurwell: false
    }
  },
  hide: function(event) {
    event.preventDefault();
    this.props.onInteraction('showMenu', false);
  },

  toggleBurwell: function() {
    this.props.onInteraction('hasBurwell', !this.props.data.hasBurwell);
  },

  toggleGMNAFaults: function() {
    this.props.onInteraction('hasGMNAFaults', !this.props.data.hasGMNAFaults);
  },

  toggleGMUSFaults: function() {
    this.props.onInteraction('hasGMUSFaults', !this.props.data.hasGMUSFaults);
  },

  toggleSatellite: function() {
    this.props.onInteraction('hasSatellite', !this.props.data.hasSatellite);
  },

  toggleOpacityBurwell: function() {
    this.setState({'showOpacityBurwell': !this.state.showOpacityBurwell})
  },

  changeOpacityBurwell: function(event) {
    this.props.onInteraction('burwellOpacity', event.currentTarget.valueAsNumber);
  },

  render: function() {
    return (
      <div className={this.props.data.showMenu ? 'unit_info moveLeft' : 'unit_info'} id='unit_info_left'>
        <div className='menu-header'>
          <img src='img/logo_small.png'/> <div className='title'>Burwell</div>

          <div className='close left' onClick={this.hide}>x</div>
        </div>

        <div className='menu-content'>
          <div className='menu-layers'>
            <div className='layer' id='burwell'>Burwell
              <i className={this.props.data.hasBurwell ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleBurwell}></i>
              <i className='fa fa-sliders layer-control' onClick={this.toggleOpacityBurwell}></i>
              <div className={!this.state.showOpacityBurwell ? 'noDisplay' : 'opacity-adjuster'}>
                <input id='geology-opacity-slider' type='range' max='100' min='0' step='10' value={this.props.data.burwellOpacity} onChange={this.changeOpacityBurwell}/>
                <div id='opacity-label'>Opacity</div>
              </div>
            </div>

            <div className='layer' id='gmnaFaults'>GMNA structures <i className={this.props.data.hasGMNAFaults ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleGMNAFaults}></i></div>
            <div className='layer' id='gmusFaults'>GMUS structures <i className={this.props.data.hasGMUSFaults ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleGMUSFaults}></i></div>
            <div className='layer' id='satellite'>Satellite <i className={this.props.data.hasSatellite ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleSatellite}></i></div>

          </div>
        </div>
      </div>
    );
  }
});

export default Menu;
