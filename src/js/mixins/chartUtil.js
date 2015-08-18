import echarts from 'echarts'

export default {
	initChart (divId, chartTitle, titleAlign, chartType, formate) {
        let chartDiv = document.getElementById(divId);
        let container = chartDiv.parentElement.parentElement;
        chartDiv.style.width = container.offsetWidth + 'px';
        chartDiv.style.height = container.offsetHeight + 'px';

        let chart = echarts.init(chartDiv);
        chart.id = divId;
        chart.formate = formate;
        let dataGrids = [],xAxisName,yAxisName;
        switch(chartType){
            case "year":
                dataGrids = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                xAxisName = "Month";
                yAxisName = "Count";
                break;
            case "quarter": 
                dataGrids = ['1st','2nd','3rd','4th'];
                xAxisName = "Quarter";
                yAxisName = "Count";
                break;
            case "week": 
                dataGrids = ['第1周','第2周','第3周','第4周'];
                xAxisName = "周";
                yAxisName = "数量";
                break;
            case "day": 
                dataGrids = ['周一','周二','周三','周四','周五','周六','周日'];
                xAxisName = "天";
                yAxisName = "数量";
                break;
            default:
                break;
        }
        chart.setOption({
            tooltip : {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                selected: {},
                data:[]
            },
            calculable : false,
            title: {
                show: false,
                x: titleAlign,
                text: chartTitle
            },
            xAxis : [
                {
                    name : xAxisName,
                    type : 'category',
                    data : dataGrids
                }
            ],
            yAxis : [
                {
                    name : yAxisName,
                    type : 'value',
                    splitArea : {show : true}
                }
            ],
            series : []
        });

        chart.addLine = (newLine)=>{
            let lineObject = chart.getOption().series;
            let lineTitle = chart.getOption().legend.data;
            newLine.type = chart.formate;
            lineObject.push(newLine);
            lineTitle.push(newLine.name.toString());
            chart.setOption({ series:lineObject, legend:{ data: lineTitle } });
        }

        chart.showLastLines = (lineCount)=>{
            let series = chart.getOption().series;
            for (let i = 0; i < series.length; i++) {
                chart.component.legend.setSelected(series[i].name, false);
                if(series.length - 1 - i < lineCount){
                    chart.component.legend.setSelected(series[i].name, true);
                }
            }
        }

        chart.addResizeFunction = () =>{
            let oldOnLoadEvent = window.onload;
            let oldOnResizeEvent = window.onresize;
            window.onload = () => {
                oldOnLoadEvent();
                chart.update();
            }
            window.onresize = () => {
                oldOnResizeEvent();
                chart.update();
            }
        }

        chart.update = () => {
            let chartDiv = document.getElementById(chart.id);
            let container = chartDiv.parentElement.parentElement;
            chartDiv.style.width = container.offsetWidth + 'px';
            chart.resize();
        }

        return chart;
    },

    jsonToChart (jsonData, dataType) {
        let chartData = [], index = 1;
        let jsonObject = JSON.parse(jsonData);
        switch(dataType){
            case "year":{
                for (let j_i = 0; j_i < jsonObject.length; j_i++) {
                    if (chartData.length == 0) {
                        chartData[0] = {};
                        chartData[0].year = jsonObject[j_i]._id.year.toString();
                        chartData[0].data = [];
                        chartData[0].data[jsonObject[j_i]._id.month - 1] = jsonObject[j_i].count;
                    };
                    for (let c_i = 0; c_i < chartData.length; c_i++) {
                        if (chartData[c_i].year == jsonObject[j_i]._id.year) {
                            chartData[c_i].data[jsonObject[j_i]._id.month - 1] = jsonObject[j_i].count;
                            break;
                        }
                        if(c_i == chartData.length - 1){
                            let data = [];
                            data[jsonObject[j_i]._id.month - 1] = jsonObject[j_i].count;
                            chartData.push({year: jsonObject[j_i]._id.year.toString(), data: data});
                            break;
                        }
                    };
                };
                let today = new Date(Date.now());
                for (let i = 0; i < chartData.length; i++) {
                    for (let j = 0; j < 12; j++) {
                        if (isNaN(+chartData[i].data[j])) {
                            if (today.getFullYear() > chartData[i].year) {
                                chartData[i].data[j] = 0;
                            } else {
                                if(today.getMonth() > j){
                                    chartData[i].data[j] = 0;
                                }
                            }
                        };
                    };
                };
                break;
            }
            case "quarter":{
                for (let j_i = 0; j_i < jsonObject.length; j_i++) {
                    if (chartData.length == 0) {
                        chartData[0] = {};
                        chartData[0].year = jsonObject[j_i]._id.year.toString();
                        chartData[0].data = [];
                        switch(jsonObject[j_i]._id.month){
                            case 1: case 2: case 3: chartData[0].data[0] = +jsonObject[j_i].count;
                            break;
                            case 4: case 5: case 6: chartData[0].data[1] = +jsonObject[j_i].count;
                            break;
                            case 7: case 8: case 9: chartData[0].data[2] = +jsonObject[j_i].count;
                            break;
                            case 10: case 11: case 12: chartData[0].data[3] = +jsonObject[j_i].count;
                            break;
                        }
                    } else {
                        for (let c_i = 0; c_i < chartData.length; c_i++) {
                            if (chartData[c_i].year == jsonObject[j_i]._id.year) {
                                switch(jsonObject[j_i]._id.month){
                                    case 1: case 2: case 3: if(isNaN(+chartData[c_i].data[0])){chartData[c_i].data[0] = 0;} chartData[c_i].data[0] += +jsonObject[j_i].count;
                                    break;
                                    case 4: case 5: case 6: if(isNaN(+chartData[c_i].data[1])){chartData[c_i].data[1] = 0;} chartData[c_i].data[1] += +jsonObject[j_i].count;
                                    break;
                                    case 7: case 8: case 9: if(isNaN(+chartData[c_i].data[2])){chartData[c_i].data[2] = 0;} chartData[c_i].data[2] += +jsonObject[j_i].count;
                                    break;
                                    case 10: case 11: case 12: if(isNaN(+chartData[c_i].data[3])){chartData[c_i].data[3] = 0;} chartData[c_i].data[3] += +jsonObject[j_i].count;
                                    break;
                                }
                                break;
                            }
                            if(c_i == chartData.length - 1){
                                let data = [];
                                switch(jsonObject[j_i]._id.month){
                                    case 1: case 2: case 3: data[0] = +jsonObject[j_i].count;
                                    break;
                                    case 4: case 5: case 6: data[1] = +jsonObject[j_i].count;
                                    break;
                                    case 7: case 8: case 9: data[2] = +jsonObject[j_i].count;
                                    break;
                                    case 10: case 11: case 12: data[3] = +jsonObject[j_i].count;
                                    break;
                                }
                                chartData.push({year: jsonObject[j_i]._id.year.toString(), data: data});
                                break;
                            }
                        };
                    }
                };
                break;
            }
            default:
                break;
        }
        return chartData;
    },

    loadXMLDoc (requestUrl, callback) {
        let xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp=new XMLHttpRequest();
        else
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                callback(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET",requestUrl,true);
        xmlhttp.send();
    }
}