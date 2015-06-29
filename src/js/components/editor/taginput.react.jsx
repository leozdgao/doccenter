import React from 'react';

export default React.createClass({
  componentDidMount () {
    let input = React.findDOMNode(this.refs.input);
    this._initialInputWidth = this._getElementWidth(input);
  },
  render () {
    let tags = this.props.tags.map((tag, i) => {
      return (
        <span key={i} className="tag">{tag}</span>
      );
    });

    return (
      <div className="textbox tag-input" onClick={this._click}>
        {tags}
        <input type="text" ref="input" onKeyDown={this._keyDown} onKeyUp={this._keyUp} onBlur={this._blur} placeholder="Tag, like: JavaScript" />
        <span className="hidden" ref="hidden"></span>
      </div>
      );
  },
  _click () {
    let input = React.findDOMNode(this.refs.input);
    input.focus();
  },
  _blur () {
    let input = React.findDOMNode(this.refs.input);
    let val = input.value.trim();
    input.value = "";
    input.style.width = this._initialInputWidth + "px";
    this._addTag(val);
  },
  _keyDown (e) {
    let input = React.findDOMNode(this.refs.input);

    switch(e.keyCode) {
      case 188: { // add tag if ','
        e.preventDefault();  // prevent the input of ','

        let val = input.value.trim();
        input.value = "";
        input.style.width = this._initialInputWidth + "px";
        this._addTag(val);
        break;
      };
      case 8: { // remove tag if 'del'
        if(input.value == '') this._removeTag();
        break;
      };
      default: {
        // dynamic adjust input width
      };
    }
  },
  _keyUp (e) {
    let input = React.findDOMNode(this.refs.input);
    let hidden = React.findDOMNode(this.refs.hidden);

    hidden.textContent = input.value;

    let wInput = this._getElementWidth(input);
    let wHidden = this._getElementWidth(hidden);
    if(wHidden + 20 > wInput) {
      input.style.width = (wInput + 20) + "px";
    }
  },
  _addTag (tag) {
    let tags = this.props.tags;
    if(tag && tags.indexOf(tag) < 0) {
      tags.push(tag);
      this.props.refreshState(tags); // change state
    }
  },
  _removeTag (index) {
    let tags = this.props.tags;

    if(typeof index == 'undefined') {
      index = tags.length - 1;
    }

    tags.splice(index, 1);
    this.props.refreshState(tags); // change state
  },
  _getElementWidth (elem) {
    let rect = elem.getBoundingClientRect();
    return rect.right - rect.left;
  }
});
