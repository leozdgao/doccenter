import React from 'react';
import Router, { Route, DefaultRoute, Link, RouteHandler } from 'react-router';
import App from './components/App.react';
import Overview from './components/Overview.react';
import Docs from './components/Docs.react';
import DocList from './components/DocList.react';
import NewDoc from './components/NewDoc.react';
import DocRender from './components/DocRender.react';
// import NotFound from './components/NotFound.react';

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
    <DefaultRoute name="overview" handler={Overview} />
    <Route name="docs" path="docs" handler={Docs} >
      <Route name="doc" path="/doc/:id" handler={DocRender} />
      <DefaultRoute handler={DocList} />
    </Route>
    {/*<Route name="slides" path="slides" handler={} />*/}
    {/*<Route name="archives" path="archives" handler={} />*/}
    <Route name="newdoc" path="newdoc" handler={NewDoc} />
    {/*<NotFoundRoute handler={NotFound} />*/}
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root />, document.body);
});
