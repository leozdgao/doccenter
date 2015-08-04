import React from 'react';
import Router, { Route, DefaultRoute, NotFoundRoute, Link, RouteHandler } from 'react-router';
import App from './components/App.react';
import Overview from './components/Overview.react';
import Docs from './components/Docs.react';
import DocList from './components/DocList.react';
import NewDoc from './components/NewDoc.react';
import EditDoc from './components/EditDoc.react';
import DocRender from './components/DocRender.react';
import NotFound from './components/NotFound.react';

// import stylesheet
import '../less/site.less';

import marked from 'marked';
import highlight from 'highlight';

highlight.configure({
  tabReplace: '  '
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
      <Route path="" handler={DocList} />
      <Route name="newdoc" path="newdoc" handler={NewDoc} />
      <Route name="edit" path="/edit/:id" handler={EditDoc} />
    </Route>
    {/*<Route name="slides" path="slides" handler={} />*/}
    {/*<Route name="archives" path="archives" handler={} />*/}
    <NotFoundRoute handler={NotFound} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root />, document.getElementById('app'));
});
