import React from 'react';
import EchartsUtil from '../../mixins/chartUtil';

export default React.createClass({
  mixins: [ EchartsUtil ],
  componentDidMount () {
    const {id, type, title, titleAlign, lastLineShow, formate} = this.props;
    const url = "http://10.10.73.208:1339/rest/statistic?conditions.year.$gte=2000&conditions.year.$lte=2120&conditions.month.$gte=1&conditions.month.$lte=12";
    let chart = this.initChart(id, title, titleAlign, type, formate);
    this.loadXMLDoc(url, (jsonData) => {
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
      <div id={this.props.id} className='chart' style={{height: +this.props.height, width: +this.props.width}}></div>
    );
  }
});
