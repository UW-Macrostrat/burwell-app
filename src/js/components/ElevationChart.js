import React from 'react'
import d3 from 'd3'

var ElevationChart = React.createClass({
  getDefaultProps() {
      return {
        showElevation: false,
        selectElevation: false,
        elevationData: []
      }
  },

  closeElevation(event) {
    event.preventDefault()
    this.props.shareState('showElevation', false)
    this.props.shareState('selectElevation', false)
    this.props.shareState('loadingElevation', false)
    this.props.shareState('elevationData', [])
    d3.select('#elevationChart').select('g').remove()
    delete this.chart
  },

  render: function() {
    let currentClass = 'elevationChartContainer'
    if (this.props.data.showElevation) {
      currentClass += ' moveUp'
    } else if (this.props.data.selectElevation) {
      currentClass += ' peek'
    }

    let ctx = d3.select('#elevationChart')

    if (ctx && this.props.data.elevationData.length && !this.chart) {
      this.drawChart()
    }

    return (
      <div className='elevationChartContainer' className={currentClass}>
        <div className='pure-g'>
          <div className='pure-u-22-24 z-header'>
            {
              (this.props.data.showElevation) ? '' :
              ((this.props.data.loadingElevation) ? 'Loading data...' : 'Click two points on the map to create an elevation profile')
            }
          </div>
          <div className='pure-u-1-12 z-header closeElevation' onClick={this.closeElevation}>
            x
          </div>
        </div>
        <div className='elevationChartWrapper'>
          <svg id="elevationChart"></svg>
        </div>
        <div className='pure-g elevation-citation'>
          <div className='pure-u-1-12'>{ parseInt(this.exageration) }x</div>
          <div className='pure-u-22-24'>
            Elevation queries via <a href='https://mapzen.com/documentation/elevation/elevation-service/' target='_blank'>Mapzen</a>, data from <a href='http://www2.jpl.nasa.gov/srtm/' target='_blank'>SRTM</a>, <a href='http://topotools.cr.usgs.gov/gmted_viewer/' target='_blank'>GMTED</a>, <a href='https://nationalmap.gov/elevation.html' target='_blank'>NED</a>, and <a href='https://www.ngdc.noaa.gov/mgg/global/' target='_blank'>ETOPO1</a>
          </div>
        </div>
      </div>
    )
  },


  drawChart() {
    // Alias these variables because d3 returns `this` in mouseover
    let data = this.props.data.elevationData
    let shareState = this.props.shareState

    let margin = {top: 20, right: 50, bottom: 30, left: 70}
    let width = window.innerWidth - margin.left - margin.right
    let height = 150 - margin.top - margin.bottom

    let bisect = d3.bisector(function(d) { return d.d }).left

    let x = d3.scale.linear()
        .range([0, width])

    let y = d3.scale.linear()
        .range([height, 0])

    let xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')

    let yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .orient('left')
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10)

    let line = d3.svg.line()
        .interpolate('basis')
        .x(d => { return x(d.d) })
        .y(d => { return y(d.elevation) })

    let area = d3.svg.area()
        .interpolate('basis')
        .x(d => { return x(d.d) })
        .y1(d => { return y(d.elevation) })

    this.chart = d3.select('#elevationChart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    let minElevation = d3.min(this.props.data.elevationData, d => { return d.elevation })
    let maxElevation = d3.max(this.props.data.elevationData, d => { return d.elevation })

    let minElevationBuffered = minElevation - ((maxElevation - minElevation) * 0.2)
    let maxElevationBuffered = maxElevation + ((maxElevation - minElevation) * 0.1)

    this.exageration = (d3.max(this.props.data.elevationData, d => { return d.d }) / width) / (((maxElevationBuffered - minElevationBuffered) * 0.001) / height)


    x.domain(d3.extent(this.props.data.elevationData, d => { return d.d }))
    y.domain([minElevationBuffered, maxElevationBuffered])

    area.y0(y(minElevationBuffered))

    this.chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
      .append('text')
        .attr('transform', `translate(${width/2}, 30)`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Distance (km)')

    this.chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', `translate(-50,${height/2})rotate(-90)`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Elevation (m)')

    this.chart.append('path')
        .datum(this.props.data.elevationData)
        .attr('class', 'line')
        .attr('fill', 'rgba(75,192,192,1)')
        .attr('stroke', 'rgba(75,192,192,1)')
        .attr('d', line)

    this.chart.append('path')
        .datum(this.props.data.elevationData)
        .attr('fill', 'rgba(75,192,192,0.4)')
        .attr('d', area)

    var focus = this.chart.append('g')
        .attr('class', 'focus')
        .style('display', 'none')

    focus.append('circle')
      .attr('fill', 'rgba(75,192,192,1)')
      .attr('fill-opacity', 1)
      .attr('stroke', 'rgba(220,220,220,1)')
      .attr('stroke-width', 2)
      .attr('r', 7)

    focus.append('text')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#333333')
      .attr('dy', '-1.2em')

    this.chart.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => { focus.style('display', null) })
        .on('mouseout', () => { focus.style('display', 'none') })
        .on('mousemove', function(e) {
          let x0 = x.invert(d3.mouse(this)[0])
          let i = bisect(data, x0, 1)
          let d0 = data[i - 1]
          let d1 = data[i]
          let d = x0 - d0.d > d1.d - x0 ? d1 : d0;
          focus.attr('transform', `translate(${x(d.d)},${y(d.elevation)})`);
          focus.select('text')
            .text(`${d.elevation} m / ${(parseInt(d.elevation) * 3.28084).toFixed(0)} ft`)

          shareState('activeElevationPoint', [d.lat, d.lng])
        })
  }
})

export default ElevationChart
