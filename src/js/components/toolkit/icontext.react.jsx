import React from 'react';

export default React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    iconClassName: React.PropTypes.string
  },
  render () {
    let {className, title} = this.props;
    return (
      <span className={className} title={title}>
        <i className={this.props.iconClassName}></i><span>{this.props.text}</span>
      </span>
    );
  }
});
