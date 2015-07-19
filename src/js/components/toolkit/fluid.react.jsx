import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {
      minHeight: 0
    };
  },
  componentDidMount: function() {
    this.setState({minHeight: this._getPageHeight()});
  },
  render () {
    return (
      <div {...this.props} style={{'minHeight': this.state.minHeight}}>
        {this.props.children}
      </div>
    );
  },
  _getPageHeight () {
    if(this.isMounted()) {
      return document.documentElement.clientHeight;
    }
  }
});
