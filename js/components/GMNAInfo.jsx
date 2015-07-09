import React from 'react';

var GMNAInfo = React.createClass({
  render: function() {
    return (
      <div className='gmna-info'>
        <h3 className='title-three'><a href='http://pubs.usgs.gov/ds/424/'>GMNA</a></h3>
        <hr/>
        <h2 className='title-two'>{this.props.data.containing_interval ? this.props.data.containing_interval : 'Unknown interval'}</h2>
        <strong>Age: </strong>
          {
            this.props.data.t_interval === this.props.data.b_interval
            ? this.props.data.t_interval
            : this.props.data.b_interval + ' - ' + this.props.data.t_interval
          } ({this.props.data.b_age} - {this.props.data.t_age}<small>Ma</small>)

        {
          this.props.data.rocktype
          ? <p><strong>Rock type: </strong> {this.props.data.rocktype}</p>
          : ''
        }
        {
          this.props.data.lith_type
          ? <p><strong>Lithology: </strong> {this.props.data.lith_type}</p>
          : ''
        }
      </div>
    );
  }
});

export default GMNAInfo;
