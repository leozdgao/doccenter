import React from 'react';
import {RouteHandler} from 'react-router';
import Sidebar from './sidebar/sidebar.react';

export default React.createClass({
  render () {
    return (
      <div>
        {/*side bar here*/}
        <Sidebar />
        {/*content*/}
        <div className="page-wrapper">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});
