import React from 'react';
import { isEmptyString, ajax } from '../util';
import Render from './content/render.react';
import AutoIndex from './content/autoIndex.react';

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
    this._getArticle(id);
  },
  render () {
    if(!this.state.badload) {
      return (
        <div>
          <Render title={this.state.article.title} tags={this.state.article.tags} content={this.state.article.content} />
          <AutoIndex content={this.state.article.content} />
        </div>
      );
    }
    // loading failed, not find or some error
    else {
      return (
        <div></div>
      )
    }
  },
  _getArticle (id) {
    let that = this;
    ajax({
      url: '/service/article/' + id,
      onload () {
        let res = JSON.parse(this.response);
        if(isEmptyString(res) || res == null) that.setState({badload: true, loading: false});
        else {
          that.setState({loading: false, article: res});
        }
      },
      onerror() {
        that.setState({badload: true, loading: false});
      }
    });
  }
});
