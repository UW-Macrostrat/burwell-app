import React from 'react';
import MacrostratInfo from './MacrostratInfo.jsx';
import ArticleInfo from './ArticleInfo.jsx';
import BurwellInfo from './BurwellInfo.jsx';
import LocationStats from './LocationStats.jsx';

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
          <LocationStats
            lat={this.props.data.lat}
            lng={this.props.data.lng}
          />
          <BurwellInfo data={this.props.data.burwell} sources={this.props.sources} onInteraction={this.props.onInteraction}/>
          <ArticleInfo data={this.props.data.articles}/>
        </div>

      </div>
    );
  }
});

export default InfoPanel;
