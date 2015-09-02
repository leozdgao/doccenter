import React from 'react';
import TablesUtil from '../../mixins/tableUtil';

export default React.createClass({
  mixins: [ TablesUtil ],
  getInitialState () {
    return {dataGet: false};
  },
  handleAjax () {
    this.setState({dataGet: !this.state.dataGet});
  },
  componentDidMount () {
    this.getJob((jobs)=>{
      console.log(jobs);
      this.jobs = jobs;
      this.handleAjax();
    });
  },
  render () {
    return (
      <tbody>
        {this.getTableLines()}
      </tbody>
    );
  },

  getTableLines () {
    let data = [];
    if (this.jobs != undefined) {
      for (var i = 0; i < this.jobs.length; i++) {
        let startDate = new Date(this.jobs[i].startDate);
        let today = new Date(Date.now());
        if (startDate.getFullYear() == today.getFullYear() && startDate.getMonth() == today.getMonth() + 1 && startDate.getDate() == today.getDate()) {
          this.jobs[i].projectId.type = "";
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isCodeBase ? "CodeBase" : "";}
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isPAPI ? "PAPI" : "";}
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isPlugin ? "Plugin" : "";}
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isProduct ? "Product" : "";}
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isUtility ? "Utility" : "";}
          if (this.jobs[i].projectId.type == "") {this.jobs[i].projectId.type = this.jobs[i].projectId.isWebService ? "WebService" : "";}

          this.jobs[i].projectId.worker = "";
          if (this.jobs[i].projectId.jobs == "") {
            for (var j = 0; j < this.jobs[i].projectId.jobs.length; j++) {
              this.jobs[i].projectId.worker += this.jobs[i].projectId.jobs[j];
            };
          }
          let date = new Date(this.jobs[i].projectId.lastUpdateDate);
          date = date.getFullYear() + "." + date.getMonth() + "." + date.getDay();
          if (this.jobs[i].projectId.companyId != null) {

          };
          data.push(
            <tr>
              <td>{this.jobs[i].projectId.companyId}</td>
              <td>CompanyName</td>
              <td>{this.jobs[i].projectId.name}</td>
              <td>{this.jobs[i].projectId.type}</td>
              <td>{this.jobs[i].projectId.worker}</td>
              <td>{date}</td>
              <td>{this.jobs[i].projectId.status}</td>
            </tr>
          );
        };
      };
      return (data);
    } else {
      data.push(<td>No projects now...</td>);
    }
  }
});
