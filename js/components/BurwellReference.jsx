import React from 'react';

var BurwellReference = React.createClass({
  hide: function() {
    this.props.onInteraction('showSource', false);
  },

  render: function() {
    return (
      <div className={this.props.data.showSource ? 'visible attr-container' : 'attr-container'} onClick={this.hide}>
        <div id='attr-info'>
          <div>
            {this.props.data.currentSource.authors + ', '}
            {this.props.data.currentSource.ref_year.length ? this.props.data.currentSource.ref_year + ', ' : ''}
            <a href={this.props.data.currentSource.url} target='_blank'>{this.props.data.currentSource.ref_title}</a>
            {this.props.data.currentSource.ref_source.length ? ': ' + this.props.data.currentSource.ref_source : ''}
            {this.props.data.currentSource.isbn_doi.length ? ', ' + this.props.data.currentSource.isbn_doi : ''}
            .
          </div>
        </div>
      </div>
    );
  }
});

export default BurwellReference;
