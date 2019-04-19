import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'

class USMap extends Component {
  loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
      .then(mapData => {
        const geoDataObj = topojsonFeature(mapData, mapData.objects.states)
        this.displayMap(geoDataObj)
      })
      .catch(err => {
        throw err
      })
  }
  displayMap(geoDataObj) {
    const width = 720
    const height = 450
    
    const projection = d3.geoIdentity()
                          .fitSize([width, height], geoDataObj)

    const path = d3.geoPath().projection(projection)
    console.log(path)

    d3.select('svg')
          .attr('width', width)
          .attr('height', height)
        .selectAll('.states')
        .data(geoDataObj.features)
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