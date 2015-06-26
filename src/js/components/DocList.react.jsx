import React from 'react';
import List from './list/doclist.react';
import TagPanel from './list/tagpanel.react';
import {ajax} from '../util';

export default React.createClass({
  getInitialState: function() {
    return {
      list: [], // the list of article which the list should render
      tags: [], // entire tags
      pageSum: 1,
      page: 1 // query?
    };
  },
  componentDidMount: function() {
    // get count of the docs

    // request for list according the pagination

    // request for tags

  },
  // request list and do pagination here
  render () {
    return (
      <div>
        <TagPanel tags={this.state.tags} />
        <List docs={this.state.list} page={this.state.page} sum={this.state.pageSum} pageChange={this._pageChange} />
      </div>
    );
  },
  _pageChange (page) {
    // request again for new page

    // set page
    this.setState({page: page});
  }
});
