import React from 'react'
import axios from 'axios'
import data from '../../data/github-licenses.json'
import ReactHighcharts from 'react-highcharts'
import _ from 'lodash'

export default class LicensePie extends React.Component {

    constructor() {
        super()
        this.config = {
        credits: { enabled: false },
        chart: { type: 'pie', backgroundColor: 'transparent' },
        title: { text: 'Top 5 Open Source Licenses' },
        tooltip: {
            formatter: function() {
                    return '<span style="color:' + this.series.color + '">'
                        + this.point.name + '</span>: <b>'
                        + (this.percentage).toFixed(2) + '%</b>'
                }
            }
        }
    }

    componentDidMount() {
        const chart = this.refs.chart.getChart()
        axios.get(data).then(d => {
            const licenses = _.chain(d.data)
              .split('\n')
              .map(JSON.parse)
              .map(d => _.mapKeys(d, (val, key) => key === 'license' ? 'name' : 'y'))
              .each(o => o.y = Math.floor(o.y))
              .take(5)
              .value()
            chart.addSeries({ data: licenses }, false)
            chart.redraw()
        })
    }

    render() {
        return (<ReactHighcharts config={ this.config } ref="chart"/>);
    }
}
