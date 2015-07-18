import React from 'react';
import marked from 'marked';
import {isEmptyString} from '../util';
import docActions from '../actions/docActions';
import docStore, {cache} from '../stores/docStore';
import Render from './content/render.react';
import AutoIndex from './content/indexer.react';
import PageHeaderActions from '../actions/pageheaderActions';

let renderer = new marked.Renderer(), seed = 0;
renderer.heading = function (text, level) {
  let id = 'header' + (seed ++);
  return '<h' + level + ' id="'+ id +'">' + text + '</h' + level + '>';
};

export default React.createClass({
  statics: {
    willTransitionTo (transition, params, query) {
      PageHeaderActions.change({breadcrumbs: [
        { text: 'Home', link: { to: 'overview' } },
        { text: 'Documents', link: {to: 'docs'} },
        { text: cache[params.id] }
      ]});
    },
  },
  getInitialState () {
    return {
      loading: true,
      article: {
        _id: '',
        title: '',
        tags: [],
        content: '',
        attachments: []
      },
      badload: false
    }
  },
  componentDidMount () {
    let id = this.props.params.id;
    docActions.docLoad(id); // action trigger
    docStore.listen((res) => {
      if(isEmptyString(res) || res == null) {
        this.setState({badload: true, loading: false});
      }
      else {
        this.setState({article: res, loading: false});
      }
    });
  },
  render () {
    if(!this.state.badload) {
      seed = 0; // reset seed
      let content = marked(this.state.article.content, { renderer: renderer });
      return (
        <div className="wrapper-content article-content">
          <AutoIndex></AutoIndex>
          <Render article={this.state.article} content={content} />
        </div>
      );
    }
    // loading failed, not find or some error
    else {
      return (
        <div></div>
      );
    }
  }
});
