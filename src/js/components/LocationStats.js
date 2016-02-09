import React from 'react';
import xhr from 'xhr';
import Config from './Config';

var LocationStats = React.createClass({
  getInitialState() {
    return {
      lat: null,
      lng: null,
      dmsLat: null,
      dmsLng: null,
      elevation: {
        ft: null,
        m: null
      },
      requests: {
        elevation: null
      }
    }
  },

  normalizeLng(lng) {
    // via https://github.com/Leaflet/Leaflet/blob/32c9156cb1d1c9bd53130639ec4d8575fbeef5a6/src/core/Util.js#L87
    return ((lng - 180) % 360 + 360) % 360 - 180;
  },

  _update(lat, lng) {
    if (this.state.requests.elevation && this.state.requests.elevation.readyState != 4) {
      this.state.requests.elevation.abort();
    }
    if (!lat || !lng) {
      return;
    }

    xhr({
      uri: `${Config.apiUrl}/elevation?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`
    }, (error, response, body) => {
      if (error) {
        console.log('Elevation error ', error);
        return;
      }

      var data = JSON.parse(body);

      this.setState({
        lat,
        lng,
        elevation: {
          ft: (data.success.data[0].elevation * 3.28084).toFixed(0),
          m: data.success.data[0].elevation
        }
      });
    });
  },

  componentDidMount() {
    this._update(this.props.lat, this.props.lng);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.lat != this.state.lat && nextProps.lng != this.state.lng) {
      this.setState({
        lat: nextProps.lat,
        lng: nextProps.lng,
        dmsLat: dd2dms(nextProps.lat, 'lat'),
        dmsLng: dd2dms(nextProps.lng, 'lng')
      });
      this._update(nextProps.lat, nextProps.lng);
    }
  },

  render: function() {
    return (
    <div className='location-stats'>
      <div className='location-stat coordinates'>
        {/*<i className='fa fa-location-arrow'></i>*/}
        <div className='coords flex-center-text'>
          <p>{this.state.lat ? this.state.lat.toFixed(4) : ''}, {this.state.lng ? this.normalizeLng(this.state.lng).toFixed(4) : ''}</p>
          {/*<p>{this.state.dmsLat}, {this.state.dmsLng}</p>*/}
        </div>
      </div>

      <div className='location-stat'>
        {/*<i className='fa fa-area-chart fa-5x'></i>*/}

        <div className='elevations flex-center-text'>
          <p>{this.state.elevation.m} <small>m</small> | {this.state.elevation.ft} <small>ft</small></p>
        </div>
      </div>
    </div>
    );
  }
});

function dd2dms(coord, type) {
  var direction;
  if (type === 'lat')
    if (coord < 0) {
      direction = 'S';
    } else {
      direction = 'N';
    }
  else {
    if (coord < 0) {
      direction = 'W'
    } else {
      direction = 'E';
    }
  }

  coord = Math.abs(coord);

  var d = Math.floor(coord),
      m = parseFloat((coord % 1).toFixed(4)) * 60,
      s = parseFloat((m % 1).toFixed(4)) * 60;

  return d + '° ' + Math.floor(m) + "' " + s.toFixed(2) + '" ' + direction;
}
export default LocationStats;
