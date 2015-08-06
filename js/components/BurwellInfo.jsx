import React from 'react';
import xhr from 'xhr';
import Config from './Config.js';
import BurwellSource from './BurwellSource.jsx';

var BurwellInfo = React.createClass({
  getInitialState() {
    return {
      sources: {}
    }
  },

  componentWillMount() {
    xhr({
      uri: `${Config.apiUrl}/defs/sources?all`
    }, function(error, response, body) {
      var data = JSON.parse(body);

      if (data.success.data.length) {
        var mappedSources = {};
        for (var i = 0; i < data.success.data.length; i++) {
          mappedSources[data.success.data[i].source_id] = data.success.data[i];
        }

        this.setState({sources: mappedSources});
      }
    }.bind(this))
  },

  render() {
    var sourceHash = this.state.sources;
    return (
    <div className='burwell-info'>
      <h3 className='title-three'><a href='#'>Burwell</a></h3>
      <hr/>
      {this.props.data.map(
        (source, idx) => <BurwellSource key={idx} data={source} sourceMap={sourceHash} />
      )}

    </div>
    );
  }
});

export default BurwellInfo;
