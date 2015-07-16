import React from 'react';
import PageHeaderActions from '../actions/pageheaderActions';
// import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  statics: {
    willTransitionTo () {
      PageHeaderActions.change({show: false});
    }
  },
  render () {
    return (
      <div>
        <h4>Overview</h4>
      </div>
    );
  }
});
