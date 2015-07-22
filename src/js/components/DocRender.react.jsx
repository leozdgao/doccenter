import React from 'react';
import Reflux from 'reflux';
import {isEmptyString} from '../util';
import docActions from '../actions/docActions';
import docStore, {cache} from '../stores/docStore';
import Render from './content/render.react';
import AutoIndex from './content/indexer.react';
import PageHeaderActions from '../actions/pageheaderActions';
import MDParser from '../mixins/markdownParser';

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
  mixins: [Reflux.ListenerMixin, MDParser],
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
    this.listenTo(docStore, (res) => {
      if(isEmptyString(res) || res == null) {
        this.setState({badload: true, loading: false});
      }
      else {
        this.setState({article: res, loading: false});
        // set breadcrumbs if cache is empty
        PageHeaderActions.change({breadcrumbs: [
          { text: 'Home', link: { to: 'overview' } },
          { text: 'Documents', link: {to: 'docs'} },
          { text: res.title }
        ]});
      }
    });
  },
  render () {
    if(!this.state.badload) {
      let content = this.mdParse(this.state.article.content);
      return (
        <div className="wrapper-content article-content">
          <AutoIndex />
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
