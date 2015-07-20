import React from 'react';
import {Link} from 'react-router';
import IconText from '../toolkit/icontext.react';

export default React.createClass({
  render () {
    return (
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-avator"><img /></div>
          <div className="sidebar-info">
            <span className="block text-bold text-hl">Leo Gao</span>
            <span className="block text-thin">Developer</span>
          </div>
        </div>
        <Link className="sidebar-btn" to="overview">
          <IconText className="icon-text" iconClassName="fa fa-globe" text="Overview" />
        </Link>
        <Link className="sidebar-btn icon-text" to="docs">
          <IconText className="icon-text" iconClassName="fa fa-file-text-o" text="Documents" />
        </Link>
      </nav>
    );
  }
});
