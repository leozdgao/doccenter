import React from 'react';
import Form from './editor/form.react.jsx';
import { Navigation } from 'react-router';

export default React.createClass({
  mixins: [Navigation],
  render () {
    return (
      <div id="editor">
        <Form postUrl="/service/article" afterPost={this._afterPost}></Form>
      </div>
    );
  },
  // recieve an article id
  _afterPost (id) {
    if(id) this.transitionTo('doc', {id: id});
  }
});
