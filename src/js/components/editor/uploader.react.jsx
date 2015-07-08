import React from 'react';
import Badge from '../toolkit/badge.react';
import IconText from '../toolkit/icontext.react';
import {arrayFrom} from '../../util';

export default React.createClass({
  componentDidMount: function() {
    this.uploader = this.refs.uploader.getDOMNode();
  },
  getInitialState: function() {
    return {
      fileList: [],
      panelShowed: false
    };
  },
  render () {
    let count = this.state.fileList.length;
    let files = this.state.fileList.map((file, i) => {
      return (
        <li key={i} className="file-entry">
          <IconText className="icon-text" iconClassName="fa fa-file-text-o" text={file.name} />
        </li>
      );
    });

    return (
      <li className="tb-btn">
        <a title="Attachments" onClick={this._addAttachments}>
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
  _togglePanel (e) {
    let showed = this.state.panelShowed;
    if(showed) this.setState({panelShowed: false});
  },
  _addAttachments (e) {
    e.stopPropagation();

    if(this.state.fileList.length <= 0) this._showInput();
    else {
      this.setState({panelShowed: true});
    }
  },
  _showInput () {
    this.uploader.click();
  },
  _fileChange () { console.log('file change');
    let files = Array.prototype.slice.call(this.uploader.files);
    let fileList = this.state.fileList.concat(files);
    if(fileList.length > 0) { // update state here
      this.setState({fileList: fileList, panelShowed: true});
    }
  }
});
