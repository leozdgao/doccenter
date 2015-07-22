import React from 'react';
import Portal from '../../../widgets/src/portal';
import {contains} from '../../utils/dom';

export default React.createClass({
  getInitialState: function() {
    return {
      promptShow: false,
      container: null,
      prompts: []
    };
  },
  componentDidMount () {
    let input = React.findDOMNode(this.refs.input);
    this._initialInputWidth = this._getElementWidth(input);
    this.setState({container: React.findDOMNode(this.refs.container)});
  },
  render () {
    let tags = this.props.tags.map((tag, i) => {
      return (
        <span key={i} className="tag">{tag}</span>
      );
    });

    return (
      <div className="cleanText tag-input" onClick={this._click}>
        <div style={{marginLeft: 10, display: 'inline-block'}}>
          {tags}
        </div>
        <div style={{position: 'relative', display: 'inline-block', zIndex: 101}}>
          <input type="text" ref="input" onKeyDown={this._keyDown} onKeyUp={this._keyUp} onBlur={this._blur} placeholder="Tag, like: JavaScript" />
          <div ref="container" ></div>
        </div>

        <span className="hidden" ref="hidden"></span>
        <div className="strip"></div>

        <Portal show={this.state.promptShow} container={this.state.container}>
          <ul className="tags-prompt" ref="prompt">
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
          </ul>
        </Portal>
      </div>
    );
  },
  _handleGlobalClick (e) {
    const prompt = React.findDOMNode(this.refs.prompt);
    if(contains(prompt, e.target)) {

    }
    else {
      this._hidePrompt();
    }
  },
  _showPrompt () {
    this.setState({promptShow: true});
    window.addEventListener('click', this._handleGlobalClick);
  },
  _hidePrompt () {
    this.setState({promptShow: false});
    window.removeEventListener('click', this._handleGlobalClick);
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
    this._hidePrompt();
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
        this._showPrompt();
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
