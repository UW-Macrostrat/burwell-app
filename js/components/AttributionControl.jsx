import React from 'react';

var AttributionControl = React.createClass({
  show: function(event) {
    event.preventDefault();
    this.props.onInteraction('showAttribution', true);
  },

  render: function() {
    return (
      <div className='leaflet-control-attribution leaflet-control menu attr' onClick={this.show}>
        <a href='#' className='info-link'>
          <div className='menu-button'>
            <div className='i'>
              <i className='fa fa-info'></i>
            </div>
          </div>
        </a>
      </div>
    );
  }
});

export default AttributionControl;
