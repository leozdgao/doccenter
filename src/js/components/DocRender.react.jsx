import React from 'react';
import { isEmptyString, ajax } from '../util';

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
          <h2>{this.state.article.title}</h2>
          <div className="markdown" dangerouslySetInnerHTML={{__html: this.state.article.content}}></div>
          <div className="spinner"></div>
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
