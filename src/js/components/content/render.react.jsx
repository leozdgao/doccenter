import React from 'react';
import {dateFormat, autoIndex} from '../../util';

export default React.createClass({
  getDefaultProps () {
    return {
      article: {},
      content: ''
    };
  },
  componentDidMount () {
    setTimeout(() => {
      let article = React.findDOMNode(this.refs.article);
      let index = autoIndex(article);
      this.props.onIndexed(index);
    }, 1000);
  },
  render () {
    let article = this.props.article;
    let tags = article.tags.map((t) => {
      return (
        <span className="tag">{t}</span>
      );
    });

    return (
      <div className="render">
        <div className="header">
          <h1>{article.title}</h1>
          <div className="tags">
            {tags}
          </div>
          <div className="hfooter">
            <span className="help-text">CreatedBy: {article.author || '?'}</span>
            <span className="help-text">CreatedDate: {dateFormat(article.date)}</span>
            <span className="help-text">LastUpdateDate: {dateFormat(article.lastUpdateDate)}</span>
          </div>
        </div>
        <div ref="article" className="markdown" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
        {/*<CommentBox />*/}
      </div>
    );
  }
  // consider some iframe service like jsfiddle
});
