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
    this.props.shareState('showMenu', false);
  },

  toggleBurwell: function() {
    this.props.shareState('hasBurwell', !this.props.data.hasBurwell);
  },

  toggleEmphasized: function() {
    this.props.shareState('hasEmphasized', !this.props.data.hasEmphasized);
  },

  toggleSatellite: function() {
    this.props.shareState('hasSatellite', !this.props.data.hasSatellite);
  },

  toggleOpacityBurwell: function() {
    this.setState({'showOpacityBurwell': !this.state.showOpacityBurwell})
  },

  changeOpacityBurwell: function(event) {
    this.props.shareState('burwellOpacity', event.currentTarget.valueAsNumber);
  },

  toggleOpacityEmphasized: function() {
    this.setState({'showOpacityEmphasized': !this.state.showOpacityEmphasized})
  },

  changeOpacityEmphasized: function(event) {
    this.props.shareState('emphasizedOpacity', event.currentTarget.valueAsNumber);
  },

  render: function() {
    return (
      <div className={this.props.data.showMenu ? 'unit_info moveLeft' : 'unit_info'} id='unit_info_left'>
        <div className='menu-header'>
          {// }<img src='img/icon_long.png'/>
          }

          <div className='close left' onClick={this.hide}>x</div>
        </div>

        <div className='menu-content'>
          <div className='menu-layers'>
            <div className='layer' id='burwell'>Bedrock
              <i className={this.props.data.hasBurwell ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleBurwell}></i>
              <i className='fa fa-sliders layer-control' onClick={this.toggleOpacityBurwell}></i>
              <div className={!this.state.showOpacityBurwell ? 'noDisplay' : 'opacity-adjuster'}>
                <input id='geology-opacity-slider' type='range' max='100' min='0' step='10' value={this.props.data.burwellOpacity} onChange={this.changeOpacityBurwell}/>
                <div id='opacity-label'>Opacity</div>
              </div>
            </div>

            <div className='layer' id='burwell'>Bedrock (emphasized)
              <i className={this.props.data.hasEmphasized ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleEmphasized}></i>
              <i className='fa fa-sliders layer-control' onClick={this.toggleOpacityEmphasized}></i>
              <div className={!this.state.showOpacityEmphasized ? 'noDisplay' : 'opacity-adjuster'}>
                <input id='geology-opacity-slider' type='range' max='100' min='0' step='10' value={this.props.data.emphasizedOpacity} onChange={this.changeOpacityEmphasized}/>
                <div id='opacity-label'>Opacity</div>
              </div>
            </div>

            <div className='layer' id='satellite'>Satellite <i className={this.props.data.hasSatellite ? 'fa fa-toggle-on layer-control' : 'fa fa-toggle-off layer-control'} onClick={this.toggleSatellite}></i></div>

          </div>
        </div>
      </div>
    );
  }
});

export default Menu;
