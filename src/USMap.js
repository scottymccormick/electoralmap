import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'

const testStateData = [
  {"Alabama":	4779736},
  {"Alaska":	710231},
  {"Arizona":	6392017},
  {"Arkansas":	2915918},
  {"California":	37253956},
  {"Colorado":	5029196},
  {"Connecticut":	3574097},
  {"Delaware":	897934},
  {"District of Columbia":	601723},
  {"Florida":	18801310},
  {"Georgia":	9687653},
  {"Hawaii":	1360301},
  {"Idaho":	1567582},
  {"Illinois":	12830632},
  {"Indiana":	6483802},
  {"Iowa":	3046355},
  {"Kansas":	2853118},
  {"Kentucky": 4339367},
  {"Louisiana":	4533372},
  {"Maine":	1328361},
  {"Maryland":	5773552},
  {"Massachusetts":	6547629},
  {"Michigan":	9883640},
  {"Minnesota":	5303925},
  {"Mississippi":	2967297},
  {"Missouri":	5988927},
  {"Montana":	989415},
  {"Nebraska":	1826341},
  {"Nevada":	2700551},
  {"New Hampshire":	1316470},
  {"New Jersey":	8791894},
  {"New Mexico": 2059179},
  {"New York": 19378102},
  {"North Carolina": 9535483},
  {"North Dakota": 672591},
  {"Ohio": 11536504},
  {"Oklahoma": 3751351},
  {"Oregon": 3831074},
  {"Pennsylvania": 12702379},
  {"Rhode Island": 1052567},
  {"South Carolina": 4625364},
  {"South Dakota": 814180},
  {"Tennessee": 6346105},
  {"Texas": 25145561},
  {"Utah": 2763885},
  {"Vermont": 625741},
  {"Virginia": 8001024},
  {"Washington": 6724540},
  {"West Virginia": 1852994},
  {"Wisconsin": 5686986},
  {"Wyoming":	563626}
]

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
    console.log(testStateData)
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