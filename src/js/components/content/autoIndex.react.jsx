import React from 'react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      content: ''
    };
  },
  render () {
    return (
      <div className="auto-index"></div>
    );
  }
});
