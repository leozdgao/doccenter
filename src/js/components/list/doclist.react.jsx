import React from 'react';
import Reflux from 'reflux';
import {Link, State} from 'react-router';
import cNames from 'classnames';
import docActions from '../../actions/docActions';
import docStore from '../../stores/docStore';
import Pagination from './pagination.react';
import SearchBox from './searchbox.react';
import IconText from '../toolkit/icontext.react';
import LoadPanel from '../toolkit/loadPanel.react';
import {dateFormat} from '../../utils/helps';

export default React.createClass({
  mixins: [Reflux.ListenerMixin, State],
  getDefaultProps () {
    return {
      page: 1,
      conditions: {}
    };
  },
  getInitialState: function() {
    return {
      panelState: 1, //loading
      docs: [],
      sum: 0
    };
  },
  componentDidMount () {
    this.load();
    this.listenTo(docStore, (ret) => {
      if(ret.fail) {
        this.setState({panelState: -1});
      }
      else {
        let {count, list} = ret;
        this.setState({sum: count, docs: list, panelState: 0});
      }
    });
  },
  load () {
    let query = this.getQuery();
    docActions.page(this._getPage(query), this._getConditions(query)); // trigger action
    if(this.state.panelState <= 0) this.setState({panelState: 1});
  },
  render () {
    const query = this.getQuery();

    return (
      <div className="doclist ibox">
        <div className="ibox-title">
          <Link className="btn btn-success btn-xs pull-right" to="newdoc">
            <IconText className="icon-text" iconClassName="fa fa-pencil">New article</IconText>
          </Link>
          <h4>Professional Service Documents</h4>
        </div>
        <LoadPanel className="ibox-content" state={this.state.panelState} onReload={this.load}>
          <div className="list-content">
            <SearchBox />
            {this._getPrompt(query)}
            {this._getSlips()}
            <Pagination page={this._getPage(query)} sum={this.state.sum} />
          </div>
        </LoadPanel>
      </div>
    );
  },
  _getSlips () {
    if(this.state.docs.length <= 0) return (<span className="help-text">No documents now...</span>);

    return this.state.docs.map((d, i) => {
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
  },
  _getPrompt (query) {
    const searchString = query.s, tagString = query.t;

    if(searchString || tagString) {
      return (
        <div>
          <h3 style={{display: 'inline-block', marginRight: 10}}>
            {`Search result for ${searchString ? `"${searchString}"`: '' }
              ${(searchString && tagString) ? 'and' : ''}
              ${tagString ? 'tag "' + tagString + '"': ''}`}
          </h3>
          <Link activeClassName="" className="btn btn-default btn-xs" to="docs">Clear</Link>
        </div>
      );
    }
    else return null;
  },
  _getPage (query) {
    return (query && query.p) || 1;
  },
  _getConditions (query) {
    let q = {};
    // tag
    if(query.t) q["tags"] = query.t;
    if(query.s) {
      q["$text"] = q["$text"] || {}; // $text: { $search: key }
      q["$text"]["$search"] =  query.s;
    }

    return q;
  }
});
