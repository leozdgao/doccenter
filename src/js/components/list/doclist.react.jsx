import React from 'react';
import {Link} from 'react-router';
import Pagination from './pagination.react';
import {dateFormat} from '../../util';

export default React.createClass({
  getDefaultProps: function() {
    return {
      docs: []
    };
  },
  render () {
    var slips =
      this.props.docs.map((d, i) => {
        return (
          <div key={i} className="slip">
            <h2 className="slip-title"><Link to="doc" params={{id: d._id}}>{d.title}</Link></h2>
            <div>
              <span className="help-text">CreateBy: {d.author || '?'}</span>
              <span className="help-text">Date: {dateFormat(d.date)}</span>
              <span className="help-text">Updated: {dateFormat(d.lastUpdateDate)}</span>
            </div>
          </div>
        );
      });
    var tip;
    if(this.props.docs.length <= 0) tip = (<div>Tips</div>);
    else tip = (<div></div>);

    return (
      <div className="doclist">
        {slips}
        <Pagination page={this.props.page} sum={this.props.pageSum} pageChange={this.props.pageChange} />
      </div>
    );
  }
});
