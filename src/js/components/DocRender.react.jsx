import React from 'react';
import Reflux from 'reflux';
import {isEmptyString} from '../utils/helps';
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
    this._load();
    this.listenTo(docStore, (res) => {
      if(isEmptyString(res) || res == null) {
        this.setState({badload: true, loading: false});
      }
      else {
        this.setState({article: res, loading: false, badload: false});
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
    let render;
    if(this.state.loading) {
      render = (<div className="middle"><span className="spinner"></span></div>);
    }
    // loading success
    else if(!this.state.badload) {
      let content = this.mdParse(this.state.article.content);
      render = [
        (<AutoIndex />),
        (<Render article={this.state.article} content={content} />)
      ];
    }
    // loading failed, not find or some error
    else {
      render = (
        <div className="middle">
          <p>Load failed, you can try again.</p>
          <div>
            <button className="btn btn-default" onClick={this._load}>
              <i className="fa fa-refresh"></i> Reload
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="wrapper-content article-content">
        {render}
      </div>
    )
  },
  _load() {
    let id = this.props.params.id;
    docActions.docLoad(id); // action trigger
    if(!this.state.loading) this.setState({loading: true});
  }
});
