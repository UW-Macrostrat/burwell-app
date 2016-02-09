import React from 'react';
import Article from './Article';

class Journal extends React.Component {
  render() {
    return (
      <div className='journal'>
        <div className='journal-title'>
          <h2 className='title-two'>{this.props.data.name} <small className='journal-source'>{this.props.data.source}</small></h2>
        </div>
        {this.props.data.articles.map(
          article => <Article key={article._id} data={article}/>
        )}
      </div>
    );
  }
}


export default Journal;
