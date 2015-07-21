import React from 'react';
import cName from 'classnames';

export default React.createClass({
  getDefaultProps () {
    return {
      validate: true
    };
  },
  render () {
    let className = cName(['editor-title', 'cleanText', {'invalid': !this.props.validate}]);
    return (
      <div className={className}>
        <input name="title" ref="title" type="text"
          value={this.props.title} onChange={this._onChange}
          placeholder="Give it a headline" />
        <div className="strip"></div>
      </div>
    );
  },
  _onChange (e) {
    this.props.refreshState(e.target.value); // change state
  }
});
