import React from 'react';

export default React.createClass({
  render () {
    return (
      <div className="checkbox">
        <label><input type="checkbox" checked={this.props.checked} onChange={this._onChange} /> TopMost</label>
      </div>
    );
  },
  _onChange (e) {
    this.props.refreshState(Number(e.target.checked)); // change state
  }
});
