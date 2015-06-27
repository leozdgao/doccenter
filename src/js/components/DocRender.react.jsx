import React from 'react';
import {isEmptyString} from '../util';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
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
  }
});
