import React from 'react';
var ReactDOM = require('react-dom');

var MenuToggle = React.createClass({
  getInitialState() {
    return {
      open: false
    }
  },
  toggle: function() {
    this.setState({open: !this.state.open});
  },

  showAttribution(event) {
    this.toggle();
    event.preventDefault();
    this.props.shareState('showAttribution', true);
  },

  showMenu(event) {
    this.toggle();
    event.preventDefault();
    this.props.shareState('showMenu', true);
  },

  getLocation(event) {
    this.toggle();
    event.preventDefault();
    this.props.locate();
  },

  drawElevation(event) {
    this.toggle();
    event.preventDefault();
//    this.props.drawElevation();
    this.props.shareState('selectElevation', true)
  },

  showSearch(event) {
    this.toggle();
    event.preventDefault();
    this.props.shareState('showSearch', true);
    document.getElementsByClassName('autocomplete-wrapper')[0].focus();
    document.getElementsByClassName('autocomplete-input')[0].focus();
    document.getElementsByClassName('autocomplete-input')[0].select();

  },

  // A little hack to make sure the menu doesn't animate on load
  componentDidMount: function() {
    setTimeout(function() {
      document.getElementsByClassName('expand-menu')[0].classList.remove('preload');
    }, 1000)

  },

  render: function() {
    var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';

    return (
      <div className='expand'>
          <div className={this.state.open ? 'expand-toggle expand-menu-center expanded' : 'expand-toggle expand-menu-center'} onClick={this.toggle}>
            <i className={this.state.open ? 'icon-minus' : 'icon-menu'}></i>
          </div>
          <div className={this.state.open ? 'expand-menu animated bounceInUp open' : 'expand-menu animated bounceOutDown closeMenu preload'}>
              <div className='expand-menu-button expand-menu-center' onClick={this.showAttribution}>
                <i className='icon-info'></i>
              </div>
              <div className='expand-menu-button expand-menu-center' onClick={this.showMenu}>
                <i className='icon-cog'></i>
              </div>
              <div className='expand-menu-button expand-menu-center' onClick={this.getLocation}>
                <i className='icon-location'></i>
              </div>
              <div className='expand-menu-button expand-menu-center' onClick={this.showSearch}>
                <i className='icon-search'></i>
              </div>
              <div className='expand-menu-button expand-menu-center' onClick={this.drawElevation}>
                <i className='icon-chart-area'></i>
              </div>
          </div>
      </div>
    );
  }
});

export default MenuToggle;
