import React from 'react';

export default React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    iconClassName: React.PropTypes.string
  },
  render () {
    return (
      <span className={this.props.className}>
        <i className={this.props.iconClassName}></i><span>{this.props.text}</span>
      </span>
    );
  }
});
