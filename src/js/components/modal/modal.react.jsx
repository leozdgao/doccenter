import React from 'react';

function noop() {}

export function showModal(content, props, container) {
  if(!container) container = getDefaultContainer();
  let closing = props.onClose;
  props.onClose = (redirect) => {
    if(closing) closing(redirect);
    // unmount
    React.unmountComponentAtNode(container);
  };

  return React.render(<Modal {...props}>{content}</Modal>, container);
}

let container;
export function getDefaultContainer() {
  if(!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  return container;
}

var Modal = React.createClass({
  getDefaultProps: function() {
    return {
      backdrop: true,
      title: 'Prompt',
      type: 'alert', // alert, confirm (decide btn group)
      width: 600,
      onClose: noop,
      onConfirm: noop,
      onCancel: noop,
      closable: true
    };
  },
  getInitialState: function() {
    return {
      visible: false,
      message: ''
      // left here
    };
  },
  componentDidMount: function() {
    this._adjustPosition();
    this.close = this.props.onClose;

    window.addEventListener('resize', this._adjustPosition);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this._adjustPosition);
  },
  render () {
    return (
      <div className="modal">
        {this.props.backdrop ? <div className="backdrop" onClick={this.props.closable ? this._onCancel: null}></div>: null}
        <div className="modal-container" style={{width: this.props.width, left: this.state.left}}>
          <div className="modal-title">{this.props.title}</div>
          <div className="modal-content">{this.props.children}</div>
          {this._getFooter()}
        </div>
      </div>
    );
  },
  _adjustPosition () {
    let vpWidth = document.documentElement.clientWidth || document.body.clientWidth;
    let mdWidth = this.props.width;
    this.setState({left: vpWidth / 2 - mdWidth / 2});
  },
  _onConfirm () {
    this.setState({message: ''});
    let confirm = this.props.onConfirm();
    if(confirm && confirm.then) { // promise
      confirm.then(() => {
        this.props.onClose(true);
      })
      .catch((e)=> {
        this.setState({message: 'Request failed.'});
      });
    }
    else {
      this.props.onClose(true);
    }
  },
  _onCancel() {
    this.props.onCancel();
    this.props.onClose(false);
  },
  _getFooter () {
    switch (this.props.type) {
      case 'alert':
        return (
          <div className="modal-footer">
            <span className="help-text err">{this.state.message}</span>
            <button className="btn primary" onClick={this._onConfirm}>Confirm</button>
          </div>
        );
      case 'confirm':
        return (
          <div className="modal-footer">
            <span className="help-text err">{this.state.message}</span>
            <button className="btn sm primary" onClick={this._onConfirm}>Confirm</button>
            <button className="btn sm default" onClick={this._onCancel}>Cancel</button>
          </div>
        );
      default: return null;
    }
  }
});

export default Modal;
