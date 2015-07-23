import React from 'react';
import {Link} from 'react-router';
import cNames from 'classnames';
import tagActions from '../../actions/tagActions';
import tagStore from '../../stores/tagStore';
import LoadPanel from '../toolkit/loadPanel.react';

export default React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      panelState: 1,
      tags: []
    };
  },
  componentDidMount: function() {
    this._load();
    this.listenTo(tagStore, (ret) => {
      if(ret.fail) this.setState({panelState: -1});
      else this.setState({tags: ret.tags, panelState: 0});
    });
  },
  render () {
    return (
      <div className="ibox tagpanel">
        <div className="ibox-title">
          <h4 className="icon-text"><i className="fa fa-tags"></i>Tags</h4>
        </div>
        <LoadPanel className="ibox-content" state={this.state.panelState} onReload={this._load}>
          {this._getTags()}
        </LoadPanel>
      </div>
    );
  },
  _getTags () {
    let tags = this.state.tags;
    if(tags.length <= 0) return (<span className="help-text">No tags now...</span>);
    else {
      let items = tags.map((item, i) => {
        return (<Link key={i} className="tag" to="docs" query={{t: item}}>{item}</Link>);
      });

      return (
        <div className="fadeIn">
          {items}
        </div>
      );
    }
  },
  _load () {
    tagActions.loadAll();
  }
});
