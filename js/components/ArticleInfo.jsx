import React from 'react';
import Journal from './Journal.jsx';

var ArticleInfo = React.createClass({
  render: function() {
    return (
      <div className={this.props.data.journals.length ? 'dd-content' : 'dd-content noDisplay'}>
        <h3 className='title-three'>Literature</h3>
        <hr/>
        {this.props.data.journals.map(function(journal, i) {
          return (
            <Journal key={i} data={journal}/>
          );
        })}
      </div>
    );
  }
});

export default ArticleInfo;
