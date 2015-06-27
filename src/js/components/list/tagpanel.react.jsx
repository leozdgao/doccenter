import React from 'react';

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
        return (<span className="tag">{item}</span>);
      });
    }
    else items = (
      <span className="help-text">No tags now...</span>
    );
    return (
      <div className="tagpanel">
        <h4 className="icon-text"><i className="fa fa-tags"></i>Tags</h4>
        <div>
          {items}
        </div>
      </div>
    );
  }
});
