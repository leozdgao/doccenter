import React from 'react';
import Badge from '../toolkit/badge.react';
import IconText from '../toolkit/icontext.react';
import Modal, {showModal, getDefaultContainer} from '../modal/modal.react';
import {arrayFrom, ajax} from '../../util';

export default React.createClass({
  componentDidMount: function() {
    this._reqs = []; // preserve xhr
    this.uploader = this.refs.uploader.getDOMNode();
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
      fileList: [],
      panelShowed: false
    };
  },
  render () {
    let count = this.state.fileList.length; console.log('render');
    let files = this.state.fileList.map((file, i) => {
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
      </li>
    );
  },
  // public method
  getFiles () {
    return this.state.fileList.map((f) => {
      return {
        key: f.key,
        name: f.name
      }
    });
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
        let content = (
          <div>Abort uploading ?</div>
        ), container = getDefaultContainer();

        this.d = showModal(content, {
          type: 'confirm',
          width: 400,
          onClose: (ret) => {
            if(ret) { // user press confirm
              let xhr = this._reqs[i];
              xhr.abort();
              fileList.splice(i, 1);
              this.setState({fileList: fileList, panelShowed: !!fileList.length});
            }
          }
        }, container);
      }
      else {
        // show modal
        let content = (
          <div>Remove this attachment ?</div>
        ), container = getDefaultContainer();

        this.d = showModal(content, {
          type: 'confirm',
          width: 400,
          onConfirm: () => {
            return ajax.delete(this.props.url + file.key, {}, 0);
          },
          onClose: (ret) => {
            if(ret) { // user press confirm
              fileList.splice(i, 1);
              this.setState({fileList: fileList, panelShowed: !!fileList.length});
            }
          }
        }, container);
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
        self._reqs[i] = ajax({ // send request and preserve
          method: 'POST',
          url: url,
          body: data,
          timeout: 0 // don't set timeout
        }, (res) => {
          let response = res[0][0]; // single file upload
          let fileList = self.state.fileList;
          fileList[i].key = response && response.key;
          fileList[i].state = 1;
          self.setState({fileList: fileList});
        }, () => {
          let fileList = self.state.fileList;
          fileList[i].state = 0;
          self.setState({fileList: fileList});
        });
      })(findex);
    }
    if(fileList.length > 0) { // update state here
      this.setState({fileList: fileList, panelShowed: true});
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
  }
});
