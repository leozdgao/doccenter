import React from 'react';
import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  render () {
    return (
      <div>
        {/*side bar here*/}
        <nav className="sidebar">
          <Link className="sidebar-btn icon-text" to="overview"><i className="fa fa-globe"></i> Overview</Link>
          <Link className="sidebar-btn icon-text" to="docs"><i className="fa fa-file-text-o"></i> Documents</Link>
          <span className="sidebar-spliter"></span>
          <Link className="sidebar-btn icon-text" to="newdoc"><i className="fa fa-pencil"></i> Write</Link>
        </nav>
        {/*content*/}
        <div className="content-container">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});
