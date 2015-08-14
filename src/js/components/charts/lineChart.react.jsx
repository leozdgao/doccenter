import React from 'react';
import EchartsUtil from '../../mixins/chartUtil';

export default React.createClass({
  mixins: [ EchartsUtil ],
  componentDidMount () {
    const id = this.props.id;
    const type = this.props.type;
    const title = this.props.title;
    const titleAlign = this.props.titleAlign;
    const lastLineShow = +this.props.lastLineShow;
    const formate = this.props.formate;
    const url = "http://10.10.73.208:1339/rest/statistic?conditions.year.$gte=2000&conditions.year.$lte=2120&conditions.month.$gte=1&conditions.month.$lte=12";
    let chart = this.initChart(id, title, titleAlign, type, formate);
    this.loadXMLDoc(url, (jsonData)=>{
      let chartData = this.jsonToChart(jsonData, type);
      for (let i = 0; i < chartData.length; i++) {
          let data = {};
          data.name = chartData[i].year;
          data.data = chartData[i].data;
          chart.addLine(data);
      };
      chart.showLastLines(lastLineShow);
    });
  },
  render () {
    return (
      <div>
        <div id={this.props.id} style={{height: +this.props.height, width: +this.props.width}}></div>
      </div>
    );
  }
});
