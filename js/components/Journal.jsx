import React from 'react';
import Article from './Article.jsx';

var Journal = React.createClass({
  render: function() {
    return (
      <div className='journal'>
        <div className='journal-title'>
          <i>{this.props.data.name}</i>
        </div>
        {this.props.data.articles.map(function(article) {
          return (
            <Article key={article._id} data={article}/>
          );
        })}
      </div>
    );
  }
});

export default Journal;
