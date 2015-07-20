import React from 'react';

export default React.createClass({
  render: function() {
    return (
      <div className="md-btngroup">
        <button className="btn btn-primary btn-sm" onClick={this.props.submit}>Post</button>
        <span className="help-text err">{this.props.message}</span>
      </div>
    );
  }
});
