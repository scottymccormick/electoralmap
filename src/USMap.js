import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'

class USMap extends Component {
  loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
      .then(mapData => {
        console.log(mapData)
        const geoData = topojsonFeature(mapData, mapData.objects.states).features
        console.log(geoData)
      })
      .catch(err => {
        throw err
      })
  }
  componentDidMount() {
    this.loadMap()
  }
  render() {
    console.log(d3)
    return (
      <div>
        <h3>US Map</h3>

      </div>
    )
  }
}

export default USMap