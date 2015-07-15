import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  getDefaultProps: function() {
    return {
      show: true
    };
  },
  render () {
    return this.props.show ? (
      <div className="page-heading">
        <h2 className="text-thin">{this.state.title}</h2>
        <ul className="breadcrumbs">

        </ul>
      </div>
    ): null;
  }
});
