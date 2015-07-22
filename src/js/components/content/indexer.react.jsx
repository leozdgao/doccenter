import React from 'react';
import Reflux from 'reflux';
import {Link} from 'react-router';
import {AutoIndexer} from '../../util';
import RenderStore from '../../stores/renderStore';

let indexer = AutoIndexer.createIndexer({maxLevel: 4});

export default React.createClass({
  mixins: [Reflux.ListenerMixin],
  getInitialState: function() {
    return {
      content: null
    };
  },
  componentDidMount: function() {
    this._indexerDOMNode = React.findDOMNode(this.refs.indexer);

    this._handleScroll();
    window.addEventListener('scroll', this._handleScroll);

    this.listenTo(RenderStore, (content) => {
      this.setState({content: content});
    });
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this._handleScroll);
  },
  render () {
    return (
      <div ref="indexer" className="auto-index">
        <h3>Article Index</h3>
        {this.state.content ? this._construct(indexer.getNode(this.state.content)) : null}
      </div>
    );
  },
  _handleScroll () {
    this._indexerDOMNode.style.position = this._getindexPosition();
  },
  _getindexPosition () {
    if(window.scrollY || window.pageYOffset < 100)  return 'absolute';
    else return 'fixed';
  },
  _construct (node) {
    let children = null;
    if(node.hasChildren() && node.getDepth() != indexer.getMaxLevel()) {
      children = node.children.map((n, i) => {
        return (
          <li key={i}>
            <a target="_self" href={`${location.pathname}#${n.data.anchor}`}>{n.data.title}</a>
            {this._construct(n)}
          </li>
        )
      });
    }
    return (
      <ul>{children}</ul>
    );
  }
});
