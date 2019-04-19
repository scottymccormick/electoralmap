import React, { Component } from 'react'
import * as d3 from 'd3'

class USMap extends Component {
  loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
      .then(data => {
        console.log(data)
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