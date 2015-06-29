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
      <div className="searchbox">
        <input ref="text" className="textbox" type="text" placeholder="Search..." onKeyDown={this._handleKeyDown} />
        <i className="fa fa-search"></i>
      </div>
      );
  },
  _handleKeyDown (e) {
    if(e.keyCode == 13) {
      let val = this.textControl.value, query = {};
      query.p = this.getQuery().p;
      query.s = val;
      this.transitionTo('docs', {}, query);
    };
  }
});
