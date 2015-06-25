import React from 'react';
import TagInput from './taginput.react';
import Editor from './editor.react';
import TitleInput from './title.react';
import ButtonGroup from './buttongroup.react';
import { isEmptyString, isDefined, isString, ajax } from '../../util';

export default React.createClass({
  propTypes: {
    postUrl: React.PropTypes.string
  },
  getInitialState () {
    return {
      title: '',
      tags: [],
      content: '',
      message: '',
      validation: {
        title: true,
        content: true
      }
    }
  },
  render () {
    return (
      <form>
        <h2 className="icon-text"><i className="fa fa-file-text-o"></i> Write Document</h2>
        <TitleInput title={this.state.title} refreshState={this._refreshState('title')} validate={this.state.validation.title} />
        <TagInput tags={this.state.tags} refreshState={this._refreshState('tags')} />
        <Editor content={this.state.content} refreshState={this._refreshState('content')} validate={this.state.validation.content} />
        <ButtonGroup submit={this._submit} message={this.state.message} />
      </form>
    );
  },
  _submit (e) {
    e.preventDefault();
    // ensure validate
    let validation = this.state.validation;
    for(let key in validation) if(validation.hasOwnProperty(key)) {
      if(!this._checkValidate(key, this.state[key])) return;
    }
    // post
    let that = this; console.log(this.state);
    ajax({
      method: 'POST',
      url: this.props.postUrl,
      body: this.state,
      onload () {
        let res = JSON.parse(this.response),
            id = res[0]._id;
        // redirect
        if(typeof that.props.afterPost == 'function') that.props.afterPost(id);
      },
      onerror (isTimeout) {
        if(isTimeout) that._setErrMsg('Request timeout.');
        else {
          let res = this.response, msg;
          if(isString(res)) msg = res;
          else msg = res.msg;

          that._setErrMsg(msg);
        }
      }
    })
  },
  _refreshState (key) {
    return (val) => {
      let temp = {};
      temp[key] = val;
      this.setState(temp);

      // check validate
      this._checkValidate(key, val);
    };
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
