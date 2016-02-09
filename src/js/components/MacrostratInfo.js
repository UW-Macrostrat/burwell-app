import React from 'react';

var MacrostratInfo = React.createClass({
  render: function() {

    return <div className={this.props.data.rank_names.length ? 'macrostrat-info macrostrat-data' : 'macrostrat-info macrostrat-data noDisplay'}>
      <hr/>

      <h2 className='title-two'>{this.props.data.strat_names.map((d, idx) => {
        return <span key={'m' + idx}><a href={'https://macrostrat.org/sift/#/strat_name/' + d.id} target='_blank'>{d.name}</a>{(idx != this.props.data.strat_names.length - 1) ? ', ' : ''} </span>
      })}</h2>

      <p className='info-attr' key='d1'><strong>Age: </strong>{this.props.data.uniqueIntervals} - ({this.props.data.b_age} - {this.props.data.t_age}<small> Ma</small>)</p>
      <p className='info-attr' key='d2'><strong>Thickness: </strong>{this.props.data.min_thick} - {this.props.data.max_thick}<small>m</small></p>
      <p className='info-attr' key='d3'><strong>PBDB Collections: </strong>{this.props.data.pbdb_collections}</p>
      <p className='info-attr' key='d4'><strong>Unit ID{this.props.data.ids.length > 1 ? 's' : ''}: </strong>{this.props.data.ids.map((d, idx) => {
        return <span key={'ab' + idx}><a href={'https://macrostrat.org/sift/#/unit/' + d} target='_blank'>{d}</a>{ (idx != this.props.data.ids.length - 1) ? ', ' : '' }</span>
      })}</p>

    <p className='info-attr reference' key='d5'><strong>Reference: </strong><a target='_blank' href='https://macrostrat.org'>Macrostrat.org</a></p>
    </div>
  }
});

export default MacrostratInfo;
