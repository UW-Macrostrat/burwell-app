import React from 'react';
import MacrostratInfo from './MacrostratInfo';
import ArticleInfo from './ArticleInfo';
import BurwellInfo from './BurwellInfo';
import LocationStats from './LocationStats';

var InfoPanel = React.createClass({

  toggle: function() {
    this.props.shareState('active', false);
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
              elevation={this.props.data.elevation}
            />
        </div>

        <div className='unit_info_content'>
          <BurwellInfo data={this.props.data.burwell} shareState={this.props.shareState}/>
          <MacrostratInfo data={this.props.data.macrostrat}/>
          <ArticleInfo data={this.props.data.articles}/>
          <div className='padding'></div>
        </div>

      </div>
    );
  }
});

export default InfoPanel;
