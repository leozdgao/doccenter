import React from 'react';

let T = React.PropsType;
let noop = () => {};

export default React.createClass({
  propTypes: {
    state: React.PropTypes.number.isRequired,
    onReload: React.PropTypes.func // dom element
  },
  getDefaultProps: function() {
    return {
      state: 0, // 0 ready, 1 loading, -1 failed
      onReload: noop
    };
  },
  render() {
    let render;
    if(this.props.state > 0) { // loading
      render = (
        <div className="middle">
          <span className="spinner"></span>        
        </div>
      );
    }
    // loading success
    else if(this.props.state < 0) { // failed
      render = (
        <div className="middle">
          <p>Load failed, you can try again.</p>
          <div>
            <button className="btn btn-default" onClick={this.props.onReload}>
              <i className="fa fa-refresh"></i> Reload
            </button>
          </div>
        </div>
      );
    }
    // loading failed, not find or some error
    else { // ready
      render = this.props.children;
    }

    return (
      <div {...this.props}>{render}</div>
    );
  }
});
