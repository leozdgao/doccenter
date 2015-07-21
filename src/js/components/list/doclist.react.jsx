import React from 'react';
import {Link} from 'react-router';
import cNames from 'classnames';
import Pagination from './pagination.react';
import SearchBox from './searchbox.react';
import IconText from '../toolkit/icontext.react';
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
      let slips =
        this.props.docs.map((d, i) => {
          return (
            <div key={i} className="slip">
              <h3 className="slip-title">
                {d.priority > 0 ? (<span className="label bkg-warning">TopMost</span>): null}
                <Link to="doc" params={{id: d._id}}>{d.title}</Link>
              </h3>
              <div>
                <span className="help-text">CreateBy: {d.author || '?'}</span>
                <span className="help-text">Date: {dateFormat(d.date)}</span>
                <span className="help-text">Updated: {dateFormat(d.lastUpdateDate)}</span>
              </div>
            </div>
          );
        });

      if(slips.length == 0) slips = (<span className="help-text">No documents now...</span>);

      const prompt = (
        <div>
          <h3 style={{display: 'inline-block', marginRight: 10}}>
            {`Search result for ${this.props.searchString ? `"${this.props.searchString}"`: '' }
              ${(this.props.searchString && this.props.tagString) ? 'and' : ''}
              ${this.props.tagString ? 'tag "' + this.props.tagString + '"': ''}`}
          </h3>
          <Link activeClassName="" className="btn btn-default btn-xs" to="docs">Clear</Link>
        </div>
      )

      return (
        <div className="doclist ibox">
          <div className="ibox-title">
            <Link className="btn btn-success btn-xs pull-right" to="newdoc">
              <IconText className="icon-text" iconClassName="fa fa-pencil">New article</IconText>
            </Link>
            <h4>Professional Service Documents</h4>
          </div>
          <div className="ibox-content">
            <SearchBox />
            {this.props.searchString || this.props.tagString ? prompt: null}
            {slips}
            <Pagination page={this.props.page} sum={this.props.sum} />
          </div>
        </div>
      );
    }
  }
});
