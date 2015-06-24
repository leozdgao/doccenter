import React from 'react';
import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  render () {
    return (
      <div>
        {/*side bar here*/}
        <nav className="sidebar">
          <Link className="sidebar-btn" to="app">All</Link>
          <Link className="sidebar-btn" to="docs">Documents</Link>
        </nav>
        <div className="">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});
