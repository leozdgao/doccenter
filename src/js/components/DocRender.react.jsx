import React from 'react';
import marked from 'marked';
import {isEmptyString} from '../util';
import docActions from '../actions/docActions';
import docStore, {cache} from '../stores/docStore';
import Render from './content/render.react';
import PageHeaderActions from '../actions/pageheaderActions';

let renderer = new marked.Renderer(), seed = 0;
renderer.heading = function (text, level) {
  let id = 'header' + (seed ++);
  return '<h' + level + ' id="'+ id +'">' + text + '</h' + level + '>';
};

export default React.createClass({
  statics: {
    willTransitionTo (transition, params, query) {
      PageHeaderActions.change({breadcrumbs: [{text: 'Home', link: { to: 'overview' }}, { text: 'Documents', link: {to: 'docs'} }, { text: cache[params.id] }]});
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
      badload: false,
      indexPosition: this._getindexPosition()
    }
  },
  componentDidMount () {
    seed = 0; // reset seed
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

    window.addEventListener('scroll', this._handleScroll);
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this._handleScroll);
  },
  render () {
    if(!this.state.badload) {
      let content = marked(this.state.article.content, { renderer: renderer });
      return (
        <div className="wrapper-content article-content">
          <div ref="indexer" className="auto-index" style={{position: this.state.indexPosition}}>
            <h3>Article Index</h3>
          </div>
          <Render article={this.state.article} content={content} onIndexed={this._handleIndex} />
        </div>
      );
    }
    // loading failed, not find or some error
    else {
      return (
        <div></div>
      );
    }
  },
  _handleIndex (ul) {
    React.findDOMNode(this.refs.indexer).appendChild(ul);
  },
  _handleScroll () {
    this.setState({indexPosition: this._getindexPosition()});
  },
  _getindexPosition () {
    if(window.scrollY < 100)  return 'absolute';
    else return 'fixed';
  }
});
