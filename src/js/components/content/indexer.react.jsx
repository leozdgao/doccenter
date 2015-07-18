import React from 'react';
import {Link} from 'react-router';
import {AutoIndexer} from '../../util';
import RenderStore from '../../stores/renderStore';

let indexer = AutoIndexer.createIndexer({maxLevel: 4});

export default React.createClass({
  getInitialState: function() {
    return {
      content: null
    };
  },
  componentDidMount: function() {
    this._indexerDOMNode = React.findDOMNode(this.refs.indexer);

    this._handleScroll();
    window.addEventListener('scroll', this._handleScroll);

    RenderStore.listen((content) => {
      this.setState({content: content});
    });
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this._handleScroll);
  },
  render () {
    function construct(node) {
      var children = null, subIndex = null;
      if(node.hasChildren() && node.getDepth() != indexer.getMaxLevel()) {
        children = node.children.map((n, i) => {
          return (
            <li key={i}>
              <a target="_self" href={'#' + n.data.anchor}>{n.data.title}</a>
              {construct(n)}
            </li>
          )
        });
        subIndex = (
          <ul>{children}</ul>
        );
      }
      return subIndex;
    }
    let indexerDOMNode = null;
    if(this.state.content) {
      let root = indexer.getNode(this.state.content);
      let items = root.children.map((node, i) => {
        return (
          <li>
            <a target="_self" href={'#' + node.data.anchor}>{node.data.title}</a>
            {construct(node)}
          </li>
        );
      });
      indexerDOMNode = (
        <ul>{items}</ul>
      )
    }

    return (
      <div ref="indexer" className="auto-index">
        <h3>Article Index</h3>
        {indexerDOMNode}
      </div>
    );
  },
  _handleScroll () {
    this._indexerDOMNode.style.position = this._getindexPosition();
  },
  _getindexPosition () {
    if(window.scrollY < 100)  return 'absolute';
    else return 'fixed';
  }
});
