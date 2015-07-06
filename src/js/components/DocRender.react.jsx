import React from 'react';
import marked from 'marked';
import {isEmptyString} from '../util';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
import Render from './content/render.react';

let renderer = new marked.Renderer(), seed = 0;
renderer.heading = function (text, level) {
  let id = 'header' + (seed ++); console.log(id);
  return '<h' + level + ' id="'+ id +'">' + text + '</h' + level + '>';
};

export default React.createClass({
  getInitialState () {
    return {
      loading: true,
      article: {
        title: '',
        tags: [],
        content: ''
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
      let content = marked(this.state.article.content, { renderer: renderer });
      return (
        <div>
          <div ref="indexer" className="auto-index">
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
  }
});
