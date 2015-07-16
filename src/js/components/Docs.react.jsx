import React from 'react';
import { RouteHandler } from 'react-router';
import PageHeaderActions from '../actions/pageheaderActions';

export default React.createClass({
  statics: {
    willTransitionTo () {
      PageHeaderActions.change({ title: 'Documents', show: true });
    }
  },
  render () {
    return (
      <RouteHandler />
    );
  }
});
