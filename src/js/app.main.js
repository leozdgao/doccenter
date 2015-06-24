import React from 'react';
import Router, { Route, Link, RouteHandler } from 'react-router';
import App from './components/App.react.jsx';
import Docs from './components/Docs.react.jsx';

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="docs" path="docs" handler={Docs} />
    {/*<Route name="slides" path="slides" handler={} />*/}
    {/*<Route name="archives" path="archives" handler={} />*/}
  </Route>
)

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root />, document.body);
});
