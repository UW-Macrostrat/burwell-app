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
    this.props.shareState('showSource', true);
  },

  render() {
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

        <p className='info-attr reference'><strong>Reference: </strong>{this.props.data.ref.authors}{this.props.data.ref.ref_year ? ', ' + this.props.data.ref.ref_year : ''}, <a target='_blank' href={this.props.data.ref.url}>{this.props.data.ref.ref_title}</a>: {this.props.data.ref.ref_source}. {this.props.data.map_id}.</p>
      </div>
    );
  }
});

export default BurwellSource;
