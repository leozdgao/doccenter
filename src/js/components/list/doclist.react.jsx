import React from 'react';
import Pagination from './pagination.react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      docs: []
    };
  },
  render () {
    var rows =
      this.props.docs.map((d) => {
        return (
          <tr>
            <td>{d.title}</td>
            <td>{d.author}</td>
            <td>{d.date}</td>
            <td>{d.lastUpdateDate}</td>
          </tr>
        );
      });
    var tip;
    if(this.props.docs.length <= 0) tip = (<div>Tips</div>);
    else tip = (<div></div>);

    return (
      <div className="doclist">
        <table>
          {/*table head*/}
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>CreateDate</th>
              <th>LastUpdateDate</th>
            </tr>
          </thead>
          {rows}
        </table>
        {tip}
        <Pagination page={this.props.page} sum={this.props.pageSum} pageChange={this.props.pageChange} />
      </div>
    );
  }
});
