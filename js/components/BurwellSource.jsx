import React from 'react';
import LongText from './LongText.jsx';
import MacrostratInfo from './MacrostratInfo.jsx';

var BurwellSource = React.createClass({
  render() {
    return (
      <div className='burwell-source'>
        <h2 className='title-two'>{this.props.data.name} <small><i>&mdash; via {this.props.sourceMap[this.props.data.source_id].name}</i></small></h2>

        <p className='info-attr'><strong>Age: </strong>
        {
          this.props.data.t_int_name === this.props.data.b_int_name
          ? this.props.data.t_int_name
          : this.props.data.b_int_name + ' - ' + this.props.data.t_int_name
        } ({this.props.data.b_int_age} - {this.props.data.t_int_age}<small>Ma</small>)
        </p>

        {
          this.props.data.strat_name
          ? <p className='info-attr'><strong>Stratigraphic name: </strong>{this.props.data.strat_name}</p>
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

        {
          this.props.data.macrostrat
          ? <MacrostratInfo data={this.props.data.macrostrat}/>
          : ''
        }
      </div>
    );
  }
});

export default BurwellSource;
