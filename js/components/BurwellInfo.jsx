import React from 'react';
import BurwellSource from './BurwellSource.jsx';

var BurwellInfo = React.createClass({
  getDefaultProps() {
      return {
        sources: {}
      }
  },

  render() {
    var sourceHash = this.props.sources;

    return (
    <div className='burwell-info'>

      {this.props.data.map(
        (source, idx) => <BurwellSource key={idx} data={source} sourceMap={sourceHash} onInteraction={this.props.onInteraction}/>
      )}

    </div>
    );
  }
});

export default BurwellInfo;
