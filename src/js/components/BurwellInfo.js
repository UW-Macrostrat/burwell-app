import React from 'react';
import BurwellSource from './BurwellSource';

var BurwellInfo = React.createClass({
  getDefaultProps() {
      return {
        sources: {}
      }
  },

  render() {
    return (
    <div className='burwell-info'>

      {this.props.data.map(
        (source, idx) => <BurwellSource key={idx} data={source} shareState={this.props.shareState}/>
      )}

    </div>
    );
  }
});

export default BurwellInfo;
