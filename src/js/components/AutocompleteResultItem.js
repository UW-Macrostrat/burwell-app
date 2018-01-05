import React from 'react';

class AutocompleteResultItem extends React.Component {
  constructor() {
    super();
    this.handleMouse = this.handleMouse.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleMouse() {
    this.props.notify(this.props.index);
  }

  handleClick() {
    this.props.select(this.props.index);
  }

  render() {
    return (
      <li
        className={(this.props.selected === this.props.index) ? 'result-item focused' : 'result-item'}
        onMouseOver={this.handleMouse}
        onMouseOut={this.handleMouse}
        onClick={this.handleClick}
      >{this.props.data}</li>
    );
  }
}

export default AutocompleteResultItem;
