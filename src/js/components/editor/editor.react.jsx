import React from 'react';
import marked from 'marked';

let renderer = new marked.Renderer(), seed = 0;
renderer.heading = function (text, level) {
  let id = 'header' + (seed ++);
  return '<h' + level + ' id="'+ id +'">' + text + '</h' + level + '>';
};

export default React.createClass({
  getDefaultProps () {
    return {
      validate: true
    }
  },
  getInitialState () {
    return {
      modeControlStyle: {
        btnEdit: '',
        btnSplit: 'active',
        btnPreview: '',
        pEditor: 'md-editor',
        pPreview: 'md-preview markdown'
      },
      panelClass: 'md-panel'
    };
  },
  componentDidMount () {
    // cache dom node
    this.textControl = React.findDOMNode(this.refs.editor);
    this.previewControl = React.findDOMNode(this.refs.preview);
    this.resizer = React.findDOMNode(this.refs.resizer);
  },
  render () {
    seed = 0; // set seed to 0 everytime render an article
    return (
      <div className={this.state.panelClass}>
        <div className="md-menubar">
          <ul className="md-modebar">
            <li className="tb-btn pull-right">
              <a className={this.state.modeControlStyle["btnPreview"]} onClick={this._previewMode} title="Preview Mode">
                <i className="fa fa-eye"></i>
              </a>
            </li> { /* preview mode */ }
            <li className="tb-btn pull-right">
              <a className={this.state.modeControlStyle["btnSplit"]} onClick={this._splitMode} title="Split Mode">
                <i className="fa fa-columns"></i>
              </a>
            </li> { /* split mode */ }
            <li className="tb-btn pull-right">
              <a className={this.state.modeControlStyle["btnEdit"]} onClick={this._editMode} title="Edit Mode">
                <i className="fa fa-pencil"></i>
              </a>
            </li> { /* edit mode */ }
            <li className="tb-btn spliter pull-right"></li>
            <li className="tb-btn pull-right"><a title="FullScreen" onClick={this._fullScreen}><i className="fa fa-arrows-alt"></i></a></li> {/* full-screen */}
          </ul>
          <ul className="md-toolbar clearfix">
            <li className="tb-btn"><a title="Bold" onClick={this._boldText}><i className="fa fa-bold"></i></a></li> {/* bold */}
            <li className="tb-btn"><a title="Italic" onClick={this._italicText}><i className="fa fa-italic"></i></a></li> {/* italic */}
            <li className="tb-btn spliter"></li>
            <li className="tb-btn"><a title="Link" onClick={this._linkText}><i className="fa fa-link"></i></a></li> {/* link */}
            <li className="tb-btn"><a title="Blockquote" onClick={this._blockquoteText}><i className="fa fa-outdent"></i></a></li> {/* blockquote */}
            <li className="tb-btn"><a title="Codeblock" onClick={this._codeText}><i className="fa fa-code"></i></a></li> {/* code */}
            <li className="tb-btn"><a title="Picture" onClick={this._pictureText}><i className="fa fa-picture-o"></i></a></li> {/* picture-o */}
            <li className="tb-btn spliter"></li>
            <li className="tb-btn"><a title="OL" onClick={this._listOlText}><i className="fa fa-list-ol"></i></a></li> {/* list-ol */}
            <li className="tb-btn"><a title="UL" onClick={this._listUlText}><i className="fa fa-list-ul"></i></a></li> {/* list-ul */}
            <li className="tb-btn"><a title="Header2" onClick={this._headerText}><i className="fa fa-header"></i></a></li> {/* header */}
          </ul>
        </div>
        <div className={this.state.modeControlStyle["pEditor"]}>
          <textarea ref="editor" name="content" value={this.props.content} onChange={this._onChange}></textarea>{/*style={{height: this.state.editorHeight + 'px'}}*/}
        </div>
        <div className={this.state.modeControlStyle["pPreview"]} ref="preview" dangerouslySetInnerHTML={{__html: marked(this.props.content, { renderer: renderer })}}></div>
        <div className="md-spliter"></div>
        {/*<div className="md-resizer" ref="resizer" onMouseDown={this._mousedown} onDragStart={this._dragstart}></div>*/}
      </div>
    );
  },
  _onChange (e) {
    // if(this._ltr) clearTimeout(this._ltr);

    // this._ltr = setTimeout(() => {
      this.props.refreshState(this.textControl.value); // change state
    // }, 300);
  },
  _preInputText (text, preStart, preEnd) {
    let start = this.textControl.selectionStart,
        end = this.textControl.selectionEnd,
        origin = this.textControl.value

    if(start != end) {
      let exist = origin.slice(start, end); console.log(exist);
      text = text.slice(0, preStart) + exist + text.slice(preEnd);
      preEnd = preStart + exist.length;
    }
    this.textControl.value = origin.slice(0, start) + text + origin.slice(end);
    // pre-select
    this.textControl.setSelectionRange(start + preStart, start + preEnd);
    this.props.refreshState(this.textControl.value); // change state
  },
  _boldText () {
    this._preInputText("**Bold**", 2, 6);
  },
  _italicText () {
    this._preInputText("_Italic_", 1, 7);
  },
  _linkText () {
    this._preInputText("[Link](www.yourlink.com)", 1, 5);
  },
  _blockquoteText () {
    this._preInputText("> Blockquote", 2, 12);
  },
  _codeText () {
    this._preInputText("```\ncode block\n```", 4, 14);
  },
  _pictureText () {
    this._preInputText("![alt](www.yourlink.com)", 2, 5);
  },
  _listUlText () {
    this._preInputText("- List Item 0\n- List Item 1", 2, 13);
  },
  _listOlText () {
    this._preInputText("1. List Item 0\n2. List Item 1", 3, 14);
  },
  _headerText () {
    this._preInputText("## Header", 3, 9);
  },
  _editMode () {
    this.setState({modeControlStyle: this._getModeStyle('edit')});
  },
  _splitMode () {
    this.setState({modeControlStyle: this._getModeStyle('split')});
  },
  _previewMode () {
    this.setState({modeControlStyle: this._getModeStyle('preview')});
  },
  _getModeStyle (mode) {
    switch (mode) {
      case 'split':
        return {
          btnEdit: '',
          btnSplit: 'active',
          btnPreview: '',
          pEditor: 'md-editor',
          pPreview: 'md-preview markdown'
        }
      case 'edit':
        return {
          btnEdit: 'active',
          btnSplit: '',
          btnPreview: '',
          pEditor: 'md-editor expand',
          pPreview: 'md-preview markdown shrink'
        }
      case 'preview':
        return {
          btnEdit: '',
          btnSplit: '',
          btnPreview: 'active',
          pEditor: 'md-editor',
          pPreview: 'md-preview markdown expand'
        }
    };
  },
  _fullScreen () {
    (this._isFullScreen = !this._isFullScreen) ?
      this.setState({panelClass: 'md-panel fullscreen'}) :
      this.setState({panelClass: 'md-panel'});
  }
});
