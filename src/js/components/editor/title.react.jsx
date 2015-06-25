import React from 'react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      validate: true
    };
  },
  render () {
    return (
      <div className={this.props.validate ? "editor-title": "editor-title invalid"}>
        <input className="textbox" name="title" ref="title" type="text"
          value={this.props.title} onChange={this._onChange}
          placeholder="Give it a headline" />
      </div>
    );
  },
  _onChange (e) {
    this.props.refreshState(e.target.value); // change state
  }
});
