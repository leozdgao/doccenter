import React from 'react';
import TablesUtil from '../../mixins/tableUtil';
import TableRow from './tablesRow.react';

export default React.createClass({
  mixins: [ TablesUtil ],
  componentDidMount () {
  },
  render () {
    return (
      <div className='tableContainer'>
        <table className="table">
          <thead>
            <tr>
              <th>ClientId</th>
              <th>Company</th>
              <th>Project</th>
              <th>Type</th>
              <th>Members</th>
              <th>Finished Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <TableRow />
        </table>
      </div>
    );
  }
});
