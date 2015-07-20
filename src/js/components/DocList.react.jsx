import React from 'react';
import Reflux from 'reflux';
import docActions from '../actions/docActions';
import docStore from '../stores/docStore';
import PageHeaderActions from '../actions/pageheaderActions';
import List from './list/doclist.react';
import TagPanel from './list/tagpanel.react';
import Fluid from './toolkit/fluid.react';
import {isInteger, isDefined, ensure} from '../util';

export default React.createClass({
  mixins: [Reflux.ListenerMixin],
  statics: {
    willTransitionTo (transition, params, query) {
      let page = query.p;
      if(isDefined(page) && !isInteger(Number(page))) { // check page
        transition.redirect('docs');
      }

      PageHeaderActions.change({breadcrumbs: [{text: 'Home', link: {to: 'overview'}}, { text: 'Documents' }]});
    },
  },
  getInitialState () {
    return {
      list: [], // the list of article which the list should render
      tags: [], // entire tags
      pageSum: 1,
      page: this._getPage(this.props.query), // default 1
      pageLoading: true,
      conditions: this._getConditions(this.props.query)
    };
  },
  componentWillReceiveProps (props) {
    if(this.props.query != props.query || this.props.params != props.params) {
      docActions.page(this._getPage(props.query), this._getConditions(props.query)); // tigger action
      this.setState({pageLoading: true});
    }
  },
  componentDidMount () {
    docActions.page(this.state.page, this.state.conditions); // trigger action
    docActions.tags();
    this.listenTo(docStore, (ret) => {
      if(!ret.fail) {
        let {count, tags, list} = ret;
        this.setState(ensure({
          pageSum: count,
          tags: tags,
          list: list,
          page: this._getPage(this.props.query),
          pageLoading: false,
          pageFail: false
          })
        );
      }
      // fail to load data
      else {
        if(ret.fail == 'page') this.setState({ pageFail: true, pageLoading: false });
        else if(ret.fail == 'tag') this.setState({ tagFail: true, pageLoading: false });
      }
    });
  },
  // request list and do pagination here
  render () {
    return (
      <div className="wrapper-content">
        <TagPanel tags={this.state.tags} loadFail={this.state.tagFail} />
        <List searchString={this.props.query.s} docs={this.state.list} page={this.state.page} sum={this.state.pageSum} loadFail={this.state.pageFail} loading={this.state.pageLoading} />
      </div>
    );
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
