import React from 'react';
import Reflux from 'reflux';
import Confirm from './modal/confirm.react';
import TagInput from './editor/taginput.react';
import Editor from './editor/editor.react';
import TitleInput from './editor/title.react';
import ButtonGroup from './editor/buttongroup.react';
import TopMost from './editor/topmost.react';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
import { Navigation } from 'react-router';
import { isEmptyString, isDefined, isString } from '../utils/helps';
import { ajax } from '../utils/ajax';
import Constant from '../constant';
import PageHeaderActions from '../actions/pageheaderActions';

export default React.createClass({
  mixins: [Navigation, Reflux.ListenerMixin],
  statics: {
    willTransitionTo (transition, params, query) {
      PageHeaderActions.change({breadcrumbs: [
        { text: 'Home', link: { to: 'overview' } },
        { text: 'Documents', link: {to: 'docs'} },
        { text: 'Edit article' }
      ]});
    },
    willTransitionFrom (transition, component, callback) {
      if(component._dirty) {
        this.refs.confirm.show()
          .resolve(callback)
          .cancel(() => {
            transition.abort();
            callback();
          });
      }
      else callback();
    }
  },
  getInitialState () {
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
  componentDidMount () {
    let id = this.props.params.id;
    docActions.getOneDoc(id);
    this.listenTo(docStore, (res) => {
      if(res.submitted) {
        this._dirty = false;
        this.transitionTo('doc', {id: res.article._id});
      }
      else {
        this.setState(res);
      }
    });
  },
  render () {
    let content = this.state.loaded ? (
        <div className="ibox">
          <div className="ibox-title">
            <h4>Edit article</h4>
          </div>
          <div className="ibox-content">
            <form>
              <TitleInput title={this.state.article.title} refreshState={this._refreshState('title')} validate={this.state.validation.title} />
              <TagInput tags={this.state.article.tags} refreshState={this._refreshState('tags')} />
              <Editor ref="editor" content={this.state.article.content} refreshState={this._refreshState('content')} validate={this.state.validation.content}
                fileUploadUrl={Constant.FILEUPLOADURL} refreshAttachment={this._refreshState('attachments')} attachments={this.state.article.attachments}
                afterRemoveAttachment={this._afterRemoveAttachment} afterAddAttachment={this._afterAddAttachment} />
              <TopMost checked={this.state.article.priority > 0} refreshState={this._refreshState('priority')} />
              <ButtonGroup submit={this._submit} message={this.state.message} enable={this.state.btnEnable} />
            </form>
          </div>
        </div>
      ) : (
        <div>{this.state.message}</div>
      );
    return (
      <div id="editor" className="wrapper-content">
        {content}

        <Confirm ref="confirm">
          Cancel editing?
        </Confirm>
      </div>
    );
  },
  _afterAddAttachment (key, name) {
    ajax.put(Constant.ARTICLEURL + this.state.article._id, { $push: {attachments: {key: key, name: name}} });
  },
  _afterRemoveAttachment (key) {
    ajax.put(Constant.ARTICLEURL + this.state.article._id, { $pull: {attachments: {key: key}} });
  },
  _submit (e) {
    e.preventDefault();
    // ensure validate
    let validation = this.state.validation;
    for(let key in validation) if(validation.hasOwnProperty(key)) {
      if(!this._checkValidate(key, this.state.article[key])) return;
    }

    if(this.refs.editor.checkRequesting()) { // show modal
      let content = (<div>There are still some files are uploading, abort them?</div>);
      showModal(content, {
        type: 'confirm',
        width: 400,
        onClose: (ret) => {
          if(ret) {
            this.refs.editor.abort();
            docActions.docUpdate(this.state.article._id, this.state.article);
          }
          // do nothing if canceled
        }
      });
    }
    else { // do submitting
      docActions.docUpdate(this.state.article._id, this.state.article);
    }
  },
  _refreshState (key) {
    return (val) => {
      this._dirty = true;
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
