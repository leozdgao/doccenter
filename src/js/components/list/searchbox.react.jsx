import React from 'react';

export default React.createClass({
  render () {
    return (
      <div className="searchbox">
        <input className="textbox" type="text" placeholder="Search..." />
        <i className="fa fa-search"></i>
      </div>
      );
  }
});
