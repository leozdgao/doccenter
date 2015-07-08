import React from 'react';

//
//  Componennts to display a badge which should has numberic value.
//  Use it like this:
//
//      <Badge value={num} />
//
export default React.createClass({
  render () {
    return (
      <i className="badge" {...props}>{this.props.value}</i>
    );
  }
});
