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
      <h3 className='title-three'><a href='#'>Burwell</a></h3>
      <hr/>
      {this.props.data.map(
        (source, idx) => <BurwellSource key={idx} data={source} sourceMap={sourceHash} onInteraction={this.props.onInteraction}/>
      )}

    </div>
    );
  }
});

export default BurwellInfo;
