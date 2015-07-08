import React from 'react';
import Badge from '../badge/badge.react';
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

    return (
      <li className="tb-btn">
        <a title="Attachments" onClick={this._addAttachments}>
          <i className="fa fa-paperclip"></i>
          {this.state.fileList.length > 0 ? <Badge value={count} /> : null}
        </a>
        <input ref="uploader" type="file" name="attachments" onChange={this._fileChange} />
        <div className="file-container">
          <ul className="file-list">
            <li className="file-entry"></li>
          </ul>
          <div className=""></div>
        </div>
      </li>
    );
  },
  _addAttachments () {
    if(this.state.fileList.length <= 0) this.uploader.click();
    else {
      this.setState({panelShowed: true});
    }
  },
  _fileChange () {
    let files = arrayFrom(this.uploader.files);
    let fileList = this.state.fileList.concat(files);
    if(fileList.length > 0) { // update state here
      
    }
  }
});
