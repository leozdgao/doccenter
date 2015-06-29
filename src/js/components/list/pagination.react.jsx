import React from 'react';
import {Link, State} from 'react-router';
import {copy} from '../../util';

// page, sum , pageChange

export default React.createClass({
  mixins: [ State ],
  render () {
    let page = this.props.page,
        sum = Math.ceil(this.props.sum / 10);

    if(page > sum) page = sum;
    if(page < 1) page = 1;

    let pages = [], i;
    if(sum > 1) {
      for(i = 0; i < sum; i ++) {
        let query = copy(this.getQuery());
        query.p = i + 1;
        pages.push(
          <Link key={i} activeClassName="" className={page == i+1 ? "page active": "page"} to="docs" query={query}>{i+1}</Link>
        );
      }
    }

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  }
});
