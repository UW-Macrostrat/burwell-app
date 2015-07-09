import React from 'react';

var Article = React.createClass({
  getInitialState: function() {
    return {
      showText: false
    }
  },

  toggle: function() {
    this.setState({'showText': !this.state.showText});
  },

  render: function() {
    return (
      <div className='dd-article'>
        <div className='dd-article-heading'>
          <a href={'http://www.sciencedirect.com/science/article/pii/' + this.props.data.fields.URL[0].split('pii/')[1]} target='_blank' className='title-link'>
            <strong>{this.props.data.fields.title[0]}</strong>
          </a>
          <i>{this.props.data.fields.authors[0]}</i>
          <i className={this.state.showText ? 'noDisplay' : 'fa fa-plus-square-o fa-lg show-content'} onClick={this.toggle}></i>
          <i className={this.state.showText ? 'fa fa-minus-square-o fa-lg show-content' : 'noDisplay'} onClick={this.toggle}></i>
        </div>
        <div className={this.state.showText ? 'dd-text' : 'noDisplay'}>
          {this.props.data.highlight.contents.map(function(snippet, i) {
            return <div key={i} className='dd-snippet' dangerouslySetInnerHTML={{__html: '...' + snippet + '...'}}></div>
          })}
        </div>
      </div>
    );
  }
});

export default Article;
