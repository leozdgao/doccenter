import React from 'react';
import Reflux from 'reflux';
import {isEmptyString} from '../utils/helps';
import docActions from '../actions/docActions';
import docStore, {cache} from '../stores/docStore';
import LoadPanel from './toolkit/loadPanel.react';
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
      panelState: 1,
      article: {
        _id: '',
        title: '',
        tags: [],
        content: '',
        attachments: []
      }
    }
  },
  componentDidMount () {
    this._load();
    this.listenTo(docStore, (res) => {
      if(isEmptyString(res) || res == null) {
        this.setState({panelState: -1});
      }
      else {
        this.setState({article: res, panelState: 0});
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
    let content = this.mdParse(this.state.article.content);

    return (
      <LoadPanel className="wrapper-content article-content" state={this.state.panelState} onReload={this._load}>
        <AutoIndex />
        <Render article={this.state.article} content={content} />
      </LoadPanel>
    )
  },
  _load() {
    let id = this.props.params.id;
    docActions.docLoad(id); // action trigger
    if(!this.state.panelState <= 0) this.setState({panelState: 1});
  }
});
