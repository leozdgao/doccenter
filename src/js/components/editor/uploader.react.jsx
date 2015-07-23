import React from 'react';
import Badge from '../toolkit/badge.react';
import IconText from '../toolkit/icontext.react';
import Confirm from '../modal/confirm.react';
import {arrayFrom} from '../../utils/helps';
import {ajax} from '../../utils/ajax';

export default React.createClass({
  componentDidMount: function() {
    this._reqs = []; // preserve xhr
    this.uploader = this.refs.uploader.getDOMNode();
  },
  getDefaultProps: function() {
    return {
      staticList: [] // static list
    };
  },
  /**
   *  file state: {
   *    name: String,
   *    key: String,
   *    state: 0(failed), 1(success), -1(uploading)
   *  }
   */
  getInitialState: function() {
    return {
      fileList: this.props.staticList.map((f) => { return { key: f.key, name: f.name, state: 1 } }),
      panelShowed: false
    };
  },
  render () {
    let count = this.state.fileList.length, fileList = this.state.fileList;
    let files = fileList.map((file, i) => {
      let brandClass;
      switch (file.state) {
        case 0: brandClass = 'bkg-error'
          break;
        case 1: brandClass = 'bkg-success';
          break;
        case -1: brandClass = 'bkg-warning';
          break;
        default: brandClass = '';
      }
      return (
        <li key={i} className="file-entry">
          <IconText className="icon-text" title={file.name} iconClassName="fa fa-file-text-o" text={file.name} />
          <span className={"brand " + brandClass}></span>
          <span onClick={this._removeAttachment(i)} className="close">&times;</span>
        </li>
      );
    });

    return (
      <li className="tb-btn">
        <a className={this.state.panelShowed ? "active": null} title="Attachments" onClick={this._addAttachments}>
          <i className="fa fa-paperclip"></i>
          {count > 0 ? <Badge value={count} /> : null}
        </a>
        <input ref="uploader" type="file" name="attachments" onChange={this._fileChange} />
        <div className="file-container" style={this.state.panelShowed ? {display: 'block'}: {display: 'none'}}>
          <div className="pad" onClick={this._togglePanel} style={this.state.panelShowed ? {display: 'block'}: {display: 'none'}}></div>
          <ul className="file-list">
            {files}
          </ul>
          <a className="file-add" onClick={this._showInput}><i className="fa fa-plus"></i> Add</a>
        </div>

        <Confirm ref="abortConfirm">Abort uploading ?</Confirm>
        <Confirm ref="removeConfirm" action={this._removeAction}>Remove attachment?</Confirm>
      </li>
    );
  },
  // public method
  getFiles () {
    return this.state.fileList.reduce((ret, next) => {
      if(next.state > 0) ret.push({key: next.key, name: next.name});
      return ret;
    }, []);
  },
  // whether has xhr which is still requesting
  hasRequesting () {
    let fileList = this.state.fileList;
    for(let i = 0, l = fileList.length; i < l; i++) {
      let f = fileList[i];
      if(f.state < 0)  return true;
    }

    return false;
  },
  _removeAction () {
    return ajax.delete(this.props.url + this._rmfile.key, {}, 0);
  },
  _togglePanel (e) {
    let showed = this.state.panelShowed;
    if(showed) this.setState({panelShowed: false});
  },
  _addAttachments (e) {
    if(this.state.fileList.length <= 0) this._showInput();
    else {
      this.setState({panelShowed: true});
    }
  },
  _removeAttachment (i) {
    return () => {
      let fileList = this.state.fileList, file = fileList[i];
      if(file.state == 0) {
        fileList.splice(i, 1);
        this.setState({fileList: fileList, panelShowed: !!fileList.length});
      }
      else if(file.state == -1) { // abort request
        this.refs.abortConfirm.show()
          .resolve(() => {
            let xhr = this._reqs[i];
            xhr.abort();
            fileList.splice(i, 1);
            this.setState({fileList: fileList, panelShowed: !!fileList.length});
          });
      }
      else {
        this._rmfile = file;
        this.refs.removeConfirm.show()
          .resolve(() => {
            fileList.splice(i, 1);
            this.setState({fileList: fileList, panelShowed: !!fileList.length});
            this._emitChange(); //change
            this.props.afterRemove && this.props.afterRemove(file.key);
          });
      }
    }
  },
  _showInput () {
    this.uploader.click();
  },
  _fileChange () {
    let files = arrayFrom(this.uploader.files);
    let fileList = this.state.fileList, url = this.props.url, self = this;
    for(let i = 0, l = files.length; i < l; i++) {
      let file = files[i];
      let findex = fileList.push({name: file.name, key: '', state: -1}) - 1;

      // upload request here
      (function(i) {
        let data = new FormData();
        data.append('file', file);
        this._reqs[i] = ajax({ // send request and preserve
          method: 'POST',
          url: url,
          body: data,
          timeout: 0 // don't set timeout
        }, (res) => {
          let response = res[0][0]; // single file upload
          let fileList = this.state.fileList;
          fileList[i].key = response && response.key;
          fileList[i].state = 1;
          this.setState({fileList: fileList});
          this._emitChange();
          this.props.afterAdd && this.props.afterAdd(fileList[i].key, fileList[i].name);
        }, () => {
          let fileList = self.state.fileList;
          fileList[i].state = 0;
          this.setState({fileList: fileList});
        });
      }.bind(this))(findex);
    }
    if(fileList.length > 0) { // update state here
      this.setState({fileList: fileList, panelShowed: true}); // don't emit change here, because the file not upload yet and haven't key
    }
    // clear file input
    this._clearInputFile();
  },
  _clearInputFile () {
    let f = this.uploader;
    if(f.value){
        try{
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        }catch(err){ }
        if(f.value){ //for IE5 ~ IE10
            var form = document.createElement('form'), parentNode = f.parentNode, ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            parentNode.insertBefore(f,ref);
            form = null;
        }
    }
  },
  _abortAllRequesting () {
    this._reqs.map((xhr) => { xhr.abort() });
  },
  _discard () {
    this._abortAllRequesting();
    this.state.fileList.map((f) => { console.log(f);
      if(f.state > 0 && !this._isStaticKey(f.key)) {
        ajax.delete(this.props.url + f.key, {}, 0); // send request, not care about fulfilled or not
      }
    });
  },
  _isStaticKey (key) {
    let slist = this.props.staticList;
    for(let i = 0, l = slist.length; i < l; i++) {
      let f = slist[i];
      if(f.key == key) return true;
    }

    return false;
  },
  _emitChange () {
    this.props.onChange && this.props.onChange();
  }
});
