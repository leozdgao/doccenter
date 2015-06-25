import React from 'react';
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';
import App from './components/App.react.jsx';
import Overview from './components/Overview.react.jsx';
import Docs from './components/Docs.react.jsx';
import NewDoc from './components/NewDoc.react.jsx';

import marked from 'marked';
import highlight from 'highlight';

highlight.configure({
  tabReplace: '  ',
  languages: ['html', 'css', 'javascript']
});

marked.setOptions({
  highlight: function (code, lang) {
    let obj = highlight.highlightAuto(code);
    return obj.value;
  }
});

let routes = (
  <Route handler={App}>
    <DefaultRoute name="overview" handler={Overview}/>
    <Route name="docs" path="docs" handler={Docs} />
    {/*<Route name="slides" path="slides" handler={} />*/}
    {/*<Route name="archives" path="archives" handler={} />*/}
    <Route name="newdoc" path="newdoc" handler={NewDoc} />
  </Route>
)

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root />, document.body);
});
