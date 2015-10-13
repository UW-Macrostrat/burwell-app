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
        <div className='unit-info-header'>
          <div className='close' onClick={this.toggle}>x</div>
            <LocationStats
              lat={this.props.data.lat}
              lng={this.props.data.lng}
            />
        </div>

        <div className={this.props.data.hasBurwell ? 'unit_info_content' : 'noDisplay'}>
          <BurwellInfo data={this.props.data.burwell} sources={this.props.sources} onInteraction={this.props.onInteraction}/>
          <MacrostratInfo data={this.props.data.macrostrat}/>
          <ArticleInfo data={this.props.data.articles}/>
          <div className='padding'></div>
        </div>

      </div>
    );
  }
});

export default InfoPanel;
