import React from 'react';

var MenuControl = React.createClass({
  show: function(event) {
    event.preventDefault();
    this.props.onInteraction('showMenu', true);
  },

  render: function() {
    return (
      <div className='leaflet-control-attribution leaflet-control menu menu-control' onClick={this.show}>
        <div className='menu-shelf'></div>
        <a href='#' className='menu-link'>
          <div className='menu-button'>
            <div className='m'>
              <i className='fa fa-gear'></i>
            </div>
          </div>
        </a>
      </div>
    );
  }
});

export default MenuControl;
