import React from 'react';
import Reflux from 'reflux';
import {Link} from 'react-router';
import BreadCrumb from './breadcrumbs.react';
import PageHeaderStore from '../../stores/pageheaderStore';

export default React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      show: true,
      title: '',
      breadcrumbs: []
    };
  },
  componentDidMount () {
    this.listenTo(PageHeaderStore, (ret) => {
      this.setState(ret);
    });
  },
  render () {
    return this.state.show ? (
      <div className="page-heading bkg-white">
        <h2 className="text-thin">{this.state.title}</h2>
        <BreadCrumb items={this.state.breadcrumbs} />
      </div>
    ): null;
  }
});
