import React from 'react';
import Journal from './Journal';

var ArticleInfo = React.createClass({
  render: function() {
    return (
      <div className={this.props.data.journals.length ? 'dd-content' : 'dd-content noDisplay'}>
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
