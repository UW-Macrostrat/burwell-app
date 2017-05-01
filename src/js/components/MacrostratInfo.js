import React from 'react';

var MacrostratInfo = React.createClass({
  getDefaultProps() {
      return {
        data: {
          strat_names: [],
          ids: [],
          rank_names: '',
          uniqueIntervals: '',
          min_min_thick: 0,
          max_thick: 0,
          pbdb_collections: 0
        }
      }
  },
  render: function() {
    if (!this.props || !this.props.data) {
      return <div></div>
    }
    if (!this.props.data.hasOwnProperty('strat_names')) {
      this.props.data.strat_names = []
    }
    if (!this.props.data.hasOwnProperty('ids')) {
      this.props.data.ids = []
    }
    return <div className={this.props.data && this.props.data.rank_names && this.props.data.rank_names.length ? 'macrostrat-info macrostrat-data' : 'macrostrat-info macrostrat-data noDisplay'}>
      <hr/>

      <h2 className={this.props.data && this.props.data.strat_names ? 'title-two' : 'noDisplay'}>{this.props.data.strat_names.map((d, idx) => {
        return <span key={'m' + idx}><a href={'https://macrostrat.org/sift/#/strat_name/' + d.id} target='_blank'>{d.name}</a>{(idx != this.props.data.strat_names.length - 1) ? ', ' : ''} </span>
      })}</h2>


      <p className={this.props.data && this.props.data.uniqueIntervals ? 'info-attr' : 'noDisplay'} key='d1'><strong>Age: </strong>{this.props.data.uniqueIntervals} - ({this.props.data.b_age} - {this.props.data.t_age}<small> Ma</small>)</p>

      {
        this.props.data && this.props.data.hasOwnProperty('max_thick')
        ?
        <p className={this.props.data && this.props.data.max_thick ? 'info-attr' : 'noDisplay'} key='d2'><strong>Thickness: </strong>{this.props.data.min_min_thick} - {this.props.data.max_thick}<small>m</small></p>
        :
        ''
      }



      <p className={this.props.data && this.props.data.pbdb_collections ? 'info-attr' : 'noDisplay'} key='d3'><strong>PBDB Collections: </strong>{this.props.data.pbdb_collections}</p>

      <p className={this.props.data && this.props.data.ids && this.props.data.ids.length ? 'info-attr' : 'noDisplay'} key='d4'><strong>Unit ID{this.props.data.ids.length > 1 ? 's' : ''}: </strong>{this.props.data.ids.map((d, idx) => {
        return <span key={'ab' + idx}><a href={'https://macrostrat.org/sift/#/unit/' + d} target='_blank'>{d}</a>{ (idx != this.props.data.ids.length - 1) ? ', ' : '' }</span>
      })}</p>


    <p className='info-attr reference' key='d5'><strong>Reference: </strong><a target='_blank' href='https://macrostrat.org'>Macrostrat.org</a></p>
    </div>
  }
});

export default MacrostratInfo;
