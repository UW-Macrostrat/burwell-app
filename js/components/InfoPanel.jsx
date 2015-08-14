import React from 'react';
import GMNAInfo from './GMNAInfo.jsx';
import GMUSInfo from './GMUSInfo.jsx';
import MacrostratInfo from './MacrostratInfo.jsx';
import ArticleInfo from './ArticleInfo.jsx';
import BurwellInfo from './BurwellInfo.jsx';

var InfoPanel = React.createClass({

  toggle: function() {
    this.props.onInteraction('active', false);
  },

  render: function() {
    var orientation = (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';

    return (
      <div className={this.props.data.active ? ('unit_info ' + ((orientation === 'portrait') ? 'moveDown' : 'moveRight')) : 'unit_info'} id={(orientation === 'portrait') ? 'unit_info_bottom' : 'unit_info_right'}>
        <div className='close' onClick={this.toggle}>x</div>

        <div className={this.props.data.hasBurwell ? 'unit_info_content' : 'noDisplay'}>
          <BurwellInfo data={this.props.data.burwell}/>
          <ArticleInfo data={this.props.data.articles}/>
        </div>

        <div className={(this.props.data.zoom < 7  && (this.props.data.hasGeology || (!(this.props.data.hasGeology) && !(this.props.data.hasBurwell)))) ? 'unit_info_content' : 'noDisplay'}>
          <GMNAInfo data={this.props.data.gmna} />
        </div>

        <div className={(this.props.data.zoom >= 5 && (this.props.data.hasGeology || (!(this.props.data.hasGeology) && !(this.props.data.hasBurwell)))) ? 'unit_info_content' : 'noDisplay'}>
          <GMUSInfo data={this.props.data.gmus}/>
          <MacrostratInfo data={this.props.data.macrostrat}/>
          <ArticleInfo data={this.props.data.articles}/>
        </div>
      </div>
    );
  }
});

export default InfoPanel;
