import React from 'react';
import {RouteHandler} from 'react-router';
import PageHeader from './scaffold/pageheader.react';
import Sidebar from './scaffold/sidebar.react';
import Fluid from './toolkit/fluid.react';

export default React.createClass({
  render () {
    return (
      <div>
        {/*side bar here*/}
        <Sidebar />
        {/*content*/}
        <Fluid className="page-wrapper bkg-grey">
          <PageHeader />
          <RouteHandler />
        </Fluid>
      </div>
    );
  }
});
