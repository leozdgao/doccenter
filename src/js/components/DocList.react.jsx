import React from 'react';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
import List from './list/doclist.react';
import TagPanel from './list/tagpanel.react';
import {isInteger, isDefined, ensure} from '../util';

export default React.createClass({
  statics: {
    willTransitionTo (transition, params, query) {
      let page = query.p;
      if(isDefined(page) && !isInteger(Number(page))) { // check page
        transition.redirect('docs');
      }
    },
  },
  getInitialState: function() {
    return {
      list: [], // the list of article which the list should render
      tags: [], // entire tags
      pageSum: 1,
      page: this.props.query.p || 1 // default 1
    };
  },
  componentDidMount: function() {
    docActions.page(this.state.page); // trigger action
    docActions.tags();
    docStore.listen((ret) => {
      let {count, tags, list} = ret;
      this.setState(ensure({pageSum: count, tags: tags, list: list}));
    });
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
    docActions.page(page); // tigger action
  }
});
