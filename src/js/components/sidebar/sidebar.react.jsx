import React from 'react';
import {Link} from 'react-router';
import IconText from '../toolkit/icontext.react';

export default React.createClass({
  render () {
    return (
      <nav className="sidebar">
        <Link className="sidebar-btn" to="overview">
          <IconText className="icon-text" iconClassName="fa fa-globe" text="Overview" />
        </Link>
        <Link className="sidebar-btn icon-text" to="docs">
          <IconText className="icon-text" iconClassName="fa fa-file-text-o" text="Documents" />
        </Link>
        <span className="sidebar-spliter"></span>
        <Link className="sidebar-btn icon-text" to="newdoc">
          <IconText className="icon-text" iconClassName="fa fa-pencil" text="Write" />
        </Link>
      </nav>
    );
  }
});
