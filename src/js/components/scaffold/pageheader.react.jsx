import React from 'react';
import {Link} from 'react-router';
import BreadCrumb from './breadcrumbs.react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      show: true
    };
  },
  render () {
    return this.props.show ? (
      <div className="page-heading bkg-white">
        <h2 className="text-thin">{this.props.title}</h2>
        <BreadCrumb items={this.props.breadcrumbs} />
      </div>
    ): null;
  }
});
