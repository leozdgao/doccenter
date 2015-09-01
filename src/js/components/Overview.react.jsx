import React from 'react';
import PageHeaderActions from '../actions/pageheaderActions';
import LineChart from './charts/lineChart.react';
import TableChart from './tables/tables.react';
// import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  componentDidMount () {
    window.onload = function() {
    }
    window.onresize = function() {
    }
  },
  statics: {
    willTransitionTo () {
      PageHeaderActions.change({show: false});
    }
  },
  render () {
    return (
      <div className="overview-wrapper">

        <div className='col-md-3'>
          <div className='ibox ibox-overview'>
            <div className='ibox-title'>
              <h3>Viewers</h3>
            </div>
            <div className='ibox-content'>
              <p>386,200</p>
            </div>
          </div>
        </div>

        <div className='col-md-3'>
          <div className='ibox ibox-overview'>
            <div className='ibox-title'>
              <h3>Members</h3>
            </div>
            <div className='ibox-content'>
              <p>40</p>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='ibox ibox-overview'>
            <div className='ibox-title'>
              <h3>Documents</h3>
            </div>
            <div className='ibox-content'>
              <p>50</p>
            </div>
          </div>
        </div>

        <div className='col-md-7'>
          <div className='ibox ibox-overview' id='myQuarterChartContainer'>
            <div className='ibox-title'>
              <h3>Quarter Report</h3>
            </div>
            <div className='ibox-content'>
              <LineChart id='myQuarterChart' type='quarter' formate='bar' titleAlign='center' lastLineShow='3'  containerId='myQuarterChartContainer'/>
            </div>
          </div>
        </div>

        <div className='col-md-7'>
          <div id='myYearChartContainer' className='ibox ibox-overview'>
            <div className='ibox-title'>
              <h3>Annual Report</h3>
            </div>
            <div className='ibox-content'>
              <LineChart id='myYearChart' type='year' formate='line' lastLineShow='3' containerId='myYearChartContainer'/>
            </div>
          </div>
        </div>

        <div className='col-md-12'>
          <div className='ibox ibox-overview'>
            <div className='ibox-title'>
              <h3>Project Viewer</h3>
            </div>
            <div className='ibox-content'>
              <div className='jobContainer'>
                <TableChart />
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
});
