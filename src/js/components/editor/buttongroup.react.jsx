import React from 'react';

export default React.createClass({
  render: function() {
    return (
      <div className="md-btngroup">
        <button className="btn primary" onClick={this.props.submit}>Post</button>
        <span className="help-text err">{this.props.message}</span>
      </div>
    );
  }
});
