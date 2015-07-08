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
      attachments: [],
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
    ajax.post(this.props.postUrl, this.state)
      .then((res) => {
        let id = res[0]._id;
        // redirect
        if(typeof this.props.afterPost == 'function') this.props.afterPost(id);
      })
      .catch((xhr) => {
        if(xhr.hasTimeout) {
          this._setErrMsg('Request timeout.');
        }
        else {
          let res, msg;
          if(xhr.status == 0) {
            msg = 'Can\'t connect to server.';
          }
          else {
            try {
              res = JSON.parse(xhr.response);
              msg = res.msg || 'Unexpected error.';
            }
            catch(e) {
              msg = 'Unknown response.';
            }
          }

          this._setErrMsg(msg);
        }
      });
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
