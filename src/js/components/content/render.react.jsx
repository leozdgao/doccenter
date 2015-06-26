import React from 'react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      title: '',
      content: '',
      tags: []
    };
  },
  render () {
    return (
      <div className="render">
        <h2>{this.props.title}</h2>
        <div className="markdown" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        {/*<CommentBox />*/}
      </div>
    );
  }
  // consider some iframe service like jsfiddle
});
