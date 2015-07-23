import React from 'react';
import { Navigation, State } from 'react-router';

// this.transitionTo('docs', {}, );

export default React.createClass({
  mixins: [Navigation, State],
  componentDidMount: function() {
    this.textControl = React.findDOMNode(this.refs.text);
  },
  render () {
    return (
      <div className="searchbox cleanText">
        <input ref="text" type="text" placeholder="Search..." onKeyDown={this._handleKeyDown} />
        <i className="fa fa-search"></i>
        <div className="strip"></div>
      </div>
      );
  },
  _handleKeyDown (e) {
    if(e.keyCode == 13) {
      let val = this.textControl.value, query = {};
      query.p = 1;
      query.s = val;
      this.transitionTo('docs', {}, query);
    };
  }
});
