import React from 'react';
import Reflux from 'reflux';
import PageHeaderActions from '../actions/pageheaderActions';
import List from './list/doclist.react';
import TagPanel from './list/tagpanel.react';
import Fluid from './toolkit/fluid.react';
import {isInteger, isDefined, ensure} from '../utils/helps';

export default React.createClass({
  statics: {
    willTransitionTo (transition, params, query) {
      let page = query.p;
      if(isDefined(page) && !isInteger(Number(page))) { // check page
        transition.redirect('docs');
      }

      PageHeaderActions.change({breadcrumbs: [{text: 'Home', link: {to: 'overview'}}, { text: 'Documents' }]});
    }
  },
  componentWillReceiveProps (props) {
    if(this.props.query != props.query || this.props.params != props.params) {
      this.refs.docList.load();
    }
  },
  // request list and do pagination here
  render () {
    return (
      <div className="wrapper-content">
        <TagPanel />
        <List ref="docList" />
      </div>
    );
  }
});
