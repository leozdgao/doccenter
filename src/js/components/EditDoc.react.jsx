import React from 'react';
import TagInput from './editor/taginput.react';
import Editor from './editor/editor.react';
import TitleInput from './editor/title.react';
import ButtonGroup from './editor/buttongroup.react';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
import { Navigation } from 'react-router';
import { isEmptyString, isDefined, isString } from '../util';

export default React.createClass({
  mixins: [Navigation],
  getInitialState: function() {
    return {
      loaded: false,
      loadFailed: false,
      submitted: false,
      submitting: false,
      article: {
        _id: ''
      },
      message: 'Loading...',
      validation: {
        title: true,
        content: true
      },
      btnEnable: true
    };
  },
  componentDidMount: function() {
    let id = this.props.params.id;
    docActions.getOneDoc(id);
    docStore.listen((res) => {
      if(res.submitted) {
        this.transitionTo('doc', {id: res.article._id});
      }
      else {
        this.setState(res);
      }
    });
  },
  render () {
    let content = this.state.loaded ? (
        <form>
          <h2 className="icon-text"><i className="fa fa-file-text-o"></i> Edit Document</h2>
          <TitleInput title={this.state.article.title} refreshState={this._refreshState('title')} validate={this.state.validation.title} />
          <TagInput tags={this.state.article.tags} refreshState={this._refreshState('tags')} />
          <Editor content={this.state.article.content} refreshState={this._refreshState('content')} validate={this.state.validation.content} />
          <ButtonGroup submit={this._submit} message={this.state.message} enable={this.state.btnEnable} />
        </form>
      ) : (
        <div>{this.state.message}</div>
      );
    return (
      <div id="editor">
        {content}
      </div>
    );
  },
  _submit (e) {
    e.preventDefault();
    // ensure validate
    let validation = this.state.validation;
    for(let key in validation) if(validation.hasOwnProperty(key)) {
      if(!this._checkValidate(key, this.state.article[key])) return;
    }

    // trigger action
    docActions.docUpdate(this.state.article._id, this.state.article);
  },
  // recieve an article id
  _afterPost (id) {
    if(id) this.transitionTo('doc', {id: id});
  },
  _refreshState (key) {
    return (val) => {
      let article = this.state.article;
      article[key] = val;
      this.setState({article: article});

      this._checkValidate(key, val);
    }
  },
  _checkValidate (key, val) {
    let msg = '', flag = true;
    if(isDefined(this.state.validation[key]) && isEmptyString(val)) {
      if(key == 'title') msg = 'Title should be populated.';
      else if(key == 'content') msg = 'Content should be populated.';

      flag = false;
    }

    this._setErrMsg(msg);

    return flag;
  },
  _setErrMsg (msg) {
    this.setState({message: msg});
  }
});
