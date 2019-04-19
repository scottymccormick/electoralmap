import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'

class USMap extends Component {
  loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
      .then(mapData => {
        const geoData = topojsonFeature(mapData, mapData.objects.states).features
        this.displayMap(geoData)
      })
      .catch(err => {
        throw err
      })
  }
  displayMap(data) {
    const width = 960
    const height = 600
    
    const path = d3.geoPath()
    console.log(path)

    d3.select('svg')
          .attr('width', width)
          .attr('height', height)
        .selectAll('.states')
        .data(data)
        .enter()
          .append('path')
          .classed('state', true)
          .attr('d', path)
  }
  componentDidMount() {
    this.loadMap()
  }
  render() {
    console.log(d3)
    return (
      <div>
        <h3>US Map</h3>
        <svg 
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    )
  }
}

export default USMap