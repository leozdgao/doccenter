import React from 'react';
import Form from './editor/form.react.jsx';
// import { Route, Link, RouteHandler } from 'react-router';

export default React.createClass({
  render () {
    return (
      <div id="editor">
        <Form postUrl="/article"></Form>
      </div>
    );
  }
});
