import React from 'react';
import Reflux from 'reflux';
import cNames from 'classnames';
import tagActions from '../../actions/tagActions';
import tagStore from '../../stores/tagStore';
import Portal from '../../../widgets/src/portal';
import {contains} from '../../utils/dom';

let tags = [];

export default React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      container: null,
      prompts: [],
      focus: false,
      promptShow: false,
      promptIndex: 0
    };
  },
  componentDidMount () {
    this._tagInput = React.findDOMNode(this.refs.input);
    this._initialInputWidth = this._getElementWidth(this._tagInput);
    this.setState({container: React.findDOMNode(this.refs.container)});

    tagActions.loadAll();
    this.listenTo(tagStore, (ret) => {
      if(!ret.fail) {
        tags = ret.tags;
      }
    });
  },
  render () {
    const tags = this.props.tags.map((tag, i) => {
      return (
        <span key={i} className="tag">{tag}</span>
      );
    });
    const stripClass = cNames(['strip', {show: this.state.focus}]);

    return (
      <div className="cleanText tag-input" onClick={this._click}>
        <div style={{marginLeft: 10, display: 'inline-block'}}>
          {tags}
        </div>
        <div style={{position: 'relative', display: 'inline-block', zIndex: 101}}>
          <input type="text" ref="input" onKeyDown={this._keyDown} onKeyUp={this._keyUp} onBlur={this._blur} placeholder="Tag, like: JavaScript" />
          <div ref="container"></div>
          {this.state.promptShow ?
             (<ul className="tags-prompt" ref="prompt">
               {this._getPrompts()}
             </ul>): null}
        </div>
        <div className={stripClass}></div>

        <span className="hidden" ref="hidden"></span>
      </div>
    );
  },
  _needShowPrompt () {
    return this.state.prompts.length > 0 && this._tagInput && this._tagInput.value.length > 0;
  },
  _handleGlobalClick (e) {
    const prompt = React.findDOMNode(this.refs.prompt);
    if(!contains(prompt, e.target)) this._hidePrompt();
  },
  _getPrompts () {
    return this.state.prompts.map((tag, i) => {
      return (<li key={i} className={cNames({active: this.state.promptIndex == i})} onClick={this._promptEntryClick(i)}>{tag}</li>);
    });
  },
  _promptEntryClick (i) {
    return (e) => {
      let input = React.findDOMNode(this.refs.input);
      input.value = '';
      this._addTag(this.state.prompts[i]);
      this._hidePrompt();
    };
  },
  _showPrompt (prompts) {
    this.setState({promptShow: true, prompts: prompts});
    window.addEventListener('click', this._handleGlobalClick);
  },
  _hidePrompt () {
    this.setState({promptShow: false, promptIndex: 0});
    window.removeEventListener('click', this._handleGlobalClick);
  },
  _click () {
    let input = React.findDOMNode(this.refs.input);
    input.focus();
    this.setState({focus: true});
  },
  _blur () {
    let input = React.findDOMNode(this.refs.input);
    let val = input.value.trim();
    input.value = "";
    input.style.width = this._initialInputWidth + "px";
    this.setState({focus: false});
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
      case 38: { // up
        if(this.state.promptShow && this.state.promptIndex > 0) {
          e.preventDefault();
          this.setState({promptIndex: this.state.promptIndex - 1});
        }
        break;
      };
      case 40: { // down
        if(this.state.promptShow && this.state.promptIndex < this.state.prompts.length - 1) {
          e.preventDefault();
          this.setState({promptIndex: this.state.promptIndex + 1});
        }
        break;
      };
      case 13: { // enter
        if(this.state.promptShow) {
          e.preventDefault();
          input.value = "";
          this._addTag(this.state.prompts[this.state.promptIndex]);
          this._hidePrompt();
        }
        break;
      };
      default: {

      };
    }
  },
  _keyUp (e) {
    let input = React.findDOMNode(this.refs.input);
    let hidden = React.findDOMNode(this.refs.hidden);

    // check prompt show or not
    if(input.value.length > 0) {
      let regex = new RegExp(`^${input.value.toLowerCase()}`);
      let prompts = tags.filter((tag) => {
        return regex.test(tag.toLowerCase());
      }).sort();

      if(prompts.length > 0) {
        this._showPrompt(prompts);
      }
      else this._hidePrompt();
    }
    else this._hidePrompt();

    // adjust input width
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
