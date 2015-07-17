import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  getDefaultProps: function() {
    return {
      items: []
    };
  },
  render () {
    let items = this.props.items.map((item, i) => {
      let mark = item.link ?
        <Link {...item.link} >{item.text}</Link> :
        <span>{item.text}</span>

      return (<li key={i}>{mark}</li>);
    });
    return (
      <ol className="breadcrumb">{items}</ol>
    );
  }
});
