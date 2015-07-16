import React from 'react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      items: []
    };
  },
  render () {
    let items = this.props.items.map((item) => {
      let mark = item.link ?
        <a href={item.link} target="_self">{item.text}</a> :
        <span>{item.text}</span>

      return (<li>{mark}</li>);
    });
    return (
      <ol className="breadcrumb">{items}</ol>
    );
  }
});
