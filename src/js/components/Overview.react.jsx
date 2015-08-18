import React from 'react';
import PageHeaderActions from '../actions/pageheaderActions';
import LineChart from './charts/lineChart.react';
// import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  componentDidMount () {
    window.onload = function() {
      // changeChartSize();
    }
    window.onresize = function() {
      // changeChartSize();
    }
    function changeChartSize() {
      let ibox = document.getElementById("chart");
      console.log(ibox.parentElement.parentElement.offsetWidth);
    }
  },
  statics: {
    willTransitionTo () {
      PageHeaderActions.change({show: false});
    }
  },
  render () {
    return (
      <div className="wrapper">
        <div className="row">

          <div className="col-md-3">
            <div className='ibox'>
              <div className='ibox-title'>
                <h3>DashBoard 1</h3>
              </div>
              <div className='ibox-content'>
                <p>386,200</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className='ibox'>
              <div className='ibox-title'>
                <h3>DashBoard 2</h3>
              </div>
              <div className='ibox-content'>
                <p>10</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className='ibox'>
              <div className='ibox-title'>
                <h3>DashBoard 3</h3>
              </div>
              <div className='ibox-content'>
                <p>40</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className='ibox'>
              <div className='ibox-title'>
                <h3>Quarter Report</h3>
              </div>
              <div className='ibox-content'>
                <LineChart id="myQuarterChart" type="quarter" formate="bar" titleAlign="center" height="300" width="500" lastLineShow="3"/>
              </div>
            </div>
          </div>

        </div>





        <div className='ibox yearChart'>
          <div className='ibox-title'>
            <h3>Annual Report</h3>
          </div>
          <div className='ibox-content'>
            <LineChart id="myYearChart" type="year" formate="line" titleAlign="center" height="400" width="700" lastLineShow="3"/>
          </div>
        </div>
      </div>
    );
  }
});
