import React from 'react';
import LongText from './LongText';

var LineInfo = React.createClass({
  getDefaultProps() {
      return {data:
      {
        name: '',
        type: '',
        direction: '',
        descrip: '',
        ref: {}
      }
    }
  },

  render() {
    if (Object.keys(this.props.data).length < 1) {
      this.props = {data:
        {
          name: '',
          type: '',
          direction: '',
          descrip: '',
          ref: {}
        }
      }
    }

    return (
    <div className={(Object.keys(this.props.data).length < 1 || (!this.props.data.name && !this.props.data.type && !this.props.data.direction && !this.props.data.descrip)) ? 'noDisplay': 'burwell-info'}>

      <div className='burwell-source'>
        <h2 className='title-two'>{this.props.data.name ? this.props.data.name : (this.props.data.type ? this.props.data.type : 'Lines') }</h2>

        {
          this.props.data.name && this.props.data.type
          ? <LongText
              title="Type"
              text={this.props.data.type}
            />
          : ''
        }

        {
          this.props.data.direction
          ? <LongText
              title="Direction"
              text={this.props.data.direction}
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

        <p className='info-attr reference'><strong>Reference: </strong>{this.props.data.ref.authors}{this.props.data.ref.ref_year ? ', ' + this.props.data.ref.ref_year : ''}, <a target='_blank' href={this.props.data.ref.url}>{this.props.data.ref.ref_title}</a>: {this.props.data.ref.ref_source}. {this.props.data.line_id}.</p>
      </div>
    </div>
    );
  }
});

export default LineInfo;
