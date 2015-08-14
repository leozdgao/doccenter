import React from 'react';
import PageHeaderActions from '../actions/pageheaderActions';
import LineChart from './charts/lineChart.react';
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
        <LineChart id="myYear" type="year" formate="line" title="Annual Report" titleAlign="center" height="300" width="700" lastLineShow="3"/>
        <LineChart id="myQuarter" type="quarter" formate="bar" title="Quarterly Report" titleAlign="center" height="300" width="700" lastLineShow="3"/>
      </div>
    );
  }
});
