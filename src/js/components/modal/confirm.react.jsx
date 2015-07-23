import React from 'react';
import Modal from '../../../widgets/src/modal';
import ActionButton from '../../../widgets/src/actionButton';

const noop = () => {};
const T = React.PropTypes;

const Confirm = React.createClass({
  PropTypes: {
    title: T.string,
    action: T.func,
    cancel: T.func
  },
  getDefaultProps: function() {
    return {
      action: noop,
      closable: true
    };
  },
  getInitialState: function() {
    return {
      message: ''
    };
  },
  componentDidMount: function() {
    this.close = this.props.onClose;
  },
  render () {
    return (
      <Modal ref="modal" modalClassName="modal-container">
        <div className="modal-title">{this.props.title || 'Confirm'}</div>
        <div className="modal-content">{this.props.children}</div>
        <div className="modal-footer">
          <span className="help-text err">{this.state.message}</span>
          <ActionButton className="btn btn-primary btn-sm" action={this.props.action}
            onResolve={this._handleResolve} onError={this._handleError}>
            Confirm
          </ActionButton>
          <ActionButton className="btn btn-default btn-sm" action={this.props.cancel}
            onResolve={this._handleCancelResolve} onError={this._handleCancelError}>
            Cancel
          </ActionButton>
        </div>
      </Modal>
    );
  },
  resolve (func) {
    this._onResolve = func;
    return this;
  },
  fail (func) {
    this._onError = func;
    return this;
  },
  cancel (func) {
    this._onCancelResolve = func;
    return this;
  },
  cancelError (func) {
    this._onCancelError = func;
    return this;
  },
  show () {
    this.refs.modal.show();
    return this;
  },
  _handleResolve () {
    if(this._onResolve) this._onResolve();
  },
  _handleError () {
    if(this._onError) this._onError();
  },
  _handleCancelResolve () {
    if(this._onCancelResolve) this._onResolveCancel();
    else this.refs.modal.hide();
  },
  _handleCancelError () {
    if(this._onCancelError) this._onCancelError();
  }
});

export default Confirm;
