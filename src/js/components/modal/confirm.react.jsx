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
      <Modal ref="modal" modalClassName="modal-container scaleIn">
        <div className="modal-title">{this.props.title || 'Confirm'}</div>
        <div className="modal-content">{this.props.children}</div>
        <div className="modal-footer">
          <span className="help-text err">{this.state.message}</span>
          <ActionButton className="btn btn-primary btn-sm" action={this.props.action}
            onResolved={this._handleResolve} onError={this._handleError} onFinish={this._handleFinish}>
            Confirm
          </ActionButton>
          <ActionButton className="btn btn-default btn-sm" action={this.props.cancel}
            onResolved={this._handleCancelResolve} onError={this._handleCancelError} onFinish={this._handleFinish}>
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
  final (func) {
    this._onFinal = func;
    return this;
  },
  show () {
    this.refs.modal.show();
    return this;
  },
  hide () {
    this.refs.modal.hide();
  },
  setMessage (msg) {
    this.setState({message: msg || ''});
  },
  _handleResolve () {
    if(this._onResolve) this._onResolve.bind(this)();
  },
  _handleError () {
    if(this._onError) this._onError.bind(this)();
  },
  _handleCancelResolve () {
    if(this._onCancelResolve) this._onCancelResolve.bind(this)();
    else this.refs.modal.hide();
  },
  _handleCancelError () {
    if(this._onCancelError) this._onCancelError.bind(this)();
  },
  _handleFinish () {
    if(this._onFinal) this._onFinal.bind(this)();
  }
});

export default Confirm;
