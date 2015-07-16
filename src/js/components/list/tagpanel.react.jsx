import React from 'react';
import {Link} from 'react-router';
import cNames from 'classnames';

export default React.createClass({
  getDefaultProps: function() {
    return {
      tags: []
    };
  },
  render () {
    let tags = this.props.tags, items;
    if(tags.length > 0) {
      items = tags.map((item, i) => {
        return (<Link key={i} className="tag" to="docs" query={{t: item}}>{item}</Link>);
      });
    }
    else items = (
      <span className="help-text">No tags now...</span>
    );
    return (
      <div className="ibox tagpanel">
        <div className="ibox-title">
          <h4 className="icon-text"><i className="fa fa-tags"></i>Tags</h4>
        </div>
        <div className="ibox-content">
          {items}
        </div>
      </div>
    );
  }
});
