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
    // Attempt to pull out only the year and not the whole date
    var year;
    try {
      year = (this.props.data.coverDate) ? this.props.data.coverDate.match(/\d{4}/)[0] : '';
    } catch(e) {
      year = '';
    }

    var url = (this.props.data.URL.indexOf('elsevier') > -1) ? 'http://www.sciencedirect.com/science/article/pii/' + this.props.data.URL.split('pii/')[1] : this.props.data.URL;

    return (
      <div className='dd-article'>
        <div className='dd-article-heading'>
          <p className='article-author'>{(this.props.data.authors) ? this.props.data.authors : 'Unknown'}, </p>

          {year.length ? (' ' + year + '. ') : ''}

          <a href={url} target='_blank' className='title-link'>
            <strong>{this.props.data.title}.</strong>
          </a>

          <i className={this.state.showText ? 'noDisplay' : 'fa fa-plus-square-o fa-lg show-content'} onClick={this.toggle}></i>
          <i className={this.state.showText ? 'fa fa-minus-square-o fa-lg show-content' : 'noDisplay'} onClick={this.toggle}></i>
        </div>
        <div className={this.state.showText ? 'dd-text auto-height' : 'dd-text'}>
          {this.props.data.highlight.map(function(snippet, i) {
            // The text from Elasticsearch sometimes has errant < and >, which mess up the html
            // so we have to do this, otherwise when React encounters one of those
            // problematic ones it stops working

            var text = snippet.replace(/<em class="hl">/g, "@@@")
                              .replace(/<\/em>/g, "***")
                              .replace(/(?:\r\n|\r|\n|\<|\>)/g, ' ')
                              .trim()
                              .replace(/@@@/g, '<em class="hl">')
                              .replace(/\*\*\*/g, '</em>');

            return <div key={i} className='dd-snippet' dangerouslySetInnerHTML={{__html: '...' + text + '...'}}></div>
          })}
        </div>
      </div>
    );
  }
});

export default Article;
