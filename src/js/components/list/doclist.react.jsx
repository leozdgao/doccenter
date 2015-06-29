import React from 'react';
import {Link} from 'react-router';
import Pagination from './pagination.react';
import SearchBox from './searchbox.react';
import {dateFormat} from '../../util';

export default React.createClass({
  getDefaultProps: function() {
    return {
      docs: [],
      loadFail: false
    };
  },
  render () {
    if(this.props.loading) {

      //[TODO] improve it with animation

      return (
        <div className="doclist">
          <SearchBox />
          <span className="help-text">loading...</span>
        </div>
      );
    }
    else if(this.props.loadFail) {
      return (
        <div className="doclist">
          <SearchBox />
          <span className="help-text">Can't fetch data from server.</span>
        </div>
      );
    }
    else {
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

      if(slips.length == 0) slips = (<span className="help-text">No documents now...</span>);

      return (
        <div className="doclist">
          <SearchBox />
          {slips}
          <Pagination page={this.props.page} sum={this.props.sum} />
        </div>
      );
    }
  }
});
