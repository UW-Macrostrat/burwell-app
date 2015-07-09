import React from 'react';

var MacrostratInfo = React.createClass({
  render: function() {
    return <div className={this.props.data.names.length ? 'macrostrat-info macrostrat-data' : 'macrostrat-info macrostrat-data noDisplay'}>
      <h3 className='title-three'>Macrostrat</h3>
      <hr/>
      <h2 className='title-two'>{this.props.data.names.join(', ')}</h2>
      <p className='info-attr'><strong>Units: </strong>{this.props.data.ids.join(', ')}</p>
      <p className='info-attr'><strong>Age: </strong>{this.props.data.uniqueIntervals} - ({this.props.data.b_age} - {this.props.data.t_age}<small>Ma</small>)</p>
      <p className='info-attr'><strong>Thickness: </strong>{this.props.data.min_thick} - {this.props.data.max_thick}<small>m</small></p>
      <p className='info-attr'><strong>PBDB Collections: </strong>{this.props.data.pbdb_collections}</p>
    </div>
  }
});

export default MacrostratInfo;
