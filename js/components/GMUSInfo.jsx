import React from 'react';
import LongText from './LongText.jsx';

var GMUSInfo = React.createClass({
  render: function() {
    return (
    <div className={(this.props.data.gid) ? 'gmus-info' : 'noDisplay' }>
      <h3 className='title-three'><a href='http://mrdata.usgs.gov/geology/state/state.php'>GMUS</a></h3>
      <hr/>
      <h2 className='title-two'>{this.props.data.unit_name}</h2>
      <p className='info-attr'><strong>USGS info: </strong><a target='_blank' href={'info?unit_link=' + this.props.data.unit_link}>{this.props.data.unit_link}</a> &mdash; <small>{this.props.data.gid}</small></p>
      <p className='info-attr'><strong>Age: </strong>
      {
        this.props.data.t_interval === this.props.data.b_interval
        ? this.props.data.t_interval
        : this.props.data.b_interval + ' - ' + this.props.data.t_interval
      } ({this.props.data.b_age} - {this.props.data.t_age}<small>Ma</small>)
      </p>


      {
        this.props.data.strat_unit
        ? <p className='info-attr'><strong>Stratigraphic unit: </strong> {this.props.data.strat_unit}</p>
        : ''
      }

      <p className='info-attr'><strong>Rock type: </strong>{this.props.data.rocktype.join(', ')} </p>
      <p className='info-attr'><strong>Lithology: </strong>{this.props.data.lithology.join(', ')} </p>

      { this.props.data.unitdesc ?
        <LongText
            title="Description"
            text={this.props.data.unitdesc}
          />
        : ''
      }

      {this.props.data.unit_com ?
        <LongText
            title="Comments"
            text={this.props.data.unit_com}
          />
        : ''
      }

    </div>
    );
  }
});

export default GMUSInfo;
