import React from 'react';
import LongText from './LongText';

var BurwellSource = React.createClass({
  getInitialState() {
    return {
      source_id: null
    }
  },

  showSource(event) {
    event.preventDefault();
  //  console.log(this.props.sourceMap[this.props.data.source_id]);
    this.props.shareState('active', false);
    this.props.shareState('currentSource', this.props.sourceMap[this.props.data.source_id]);
    this.props.shareState('showSource', true);
  },

  render() {
    var reference = this.props.sourceMap[this.props.data.source_id];
    return (
      <div className='burwell-source'>
        <h2 className='title-two'>{this.props.data.name}</h2>

        <p className='info-attr'><strong>Age: </strong>
        {
          this.props.data.t_int_name === this.props.data.b_int_name
          ? this.props.data.t_int_name
          : this.props.data.b_int_name + ' - ' + this.props.data.t_int_name
        } ({this.props.data.b_int_age} - {this.props.data.t_int_age}<small> Ma</small>)
        </p>

        {
          this.props.data.strat_name
          ? <LongText
              title='Stratigraphic name'
              text={this.props.data.strat_name}
            />
          : ''
        }

        {
          this.props.data.descrip
          ? <LongText
              title="Description"
              text={this.props.data.descrip}
            />
          : ''
        }

        {
          this.props.data.comments
          ? <LongText
              title="Comments"
              text={this.props.data.comments}
            />
          : ''
        }

        {
          this.props.data.lith
          ? <LongText
              title="Lithology"
              text={this.props.data.lith}
            />
          : ''
        }

        <p className='info-attr reference'><strong>Reference: </strong>{reference.authors}{reference.ref_year ? ', ' + reference.ref_year : ''}, <a target='_blank' href={reference.url}>{reference.ref_title}</a>: {reference.ref_source}. {this.props.data.map_id}.</p>
      </div>
    );
  }
});

export default BurwellSource;
