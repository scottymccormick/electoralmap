import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'

const testStateData = [
  {
    name: "Alabama", 
    population: 4779736
  },
  {
    name: "Alaska", 
    population: 710231
  },
  {
    name: "Arizona", 
    population: 6392017
  },
  {
    name: "Arkansas", 
    population: 2915918
  },
  {
    name: "California", 
    population: 37253956
  },
  {
    name: "Colorado", 
    population: 5029196
  },
  {
    name: "Connecticut", 
    population: 3574097
  },
  {
    name: "Delaware", 
    population: 897934
  },
  {
    name: "District of Columbia", 
    population: 601723
  },
  {
    name: "Florida", 
    population: 18801310
  },
  {
    name: "Georgia", 
    population: 9687653
  },
  {
    name: "Hawaii", 
    population: 1360301
  },
  {
    name: "Idaho", 
    population: 1567582
  },
  {
    name: "Illinois", 
    population: 12830632
  },
  {
    name: "Indiana", 
    population: 6483802
  },
  {
    name: "Iowa", 
    population: 3046355
  },
  {
    name: "Kansas", 
    population: 2853118
  },
  {
    name: "Kentucky", 
    population: 4339367
  },
  {
    name: "Louisiana", 
    population: 4533372
  },
  {
    name: "Maine", 
    population: 1328361
  },
  {
    name: "Maryland", 
    population: 5773552
  },
  {
    name: "Massachusetts", 
    population: 6547629
  },
  {
    name: "Michigan", 
    population: 9883640
  },
  {
    name: "Minnesota", 
    population: 5303925
  },
  {
    name: "Mississippi", 
    population: 2967297
  },
  {
    name: "Missouri", 
    population: 5988927
  },
  {
    name: "Montana", 
    population: 989415
  },
  {
    name: "Nebraska", 
    population: 1826341
  },
  {
    name: "Nevada", 
    population: 2700551
  },
  {
    name: "New Hampshire", 
    population: 1316470
  },
  {
    name: "New Jersey", 
    population: 8791894
  },
  {
    name: "New Mexico", 
    population: 2059179
  },
  {
    name: "New York", 
    population: 19378102
  },
  {
    name: "North Carolina", 
    population: 9535483
  },
  {
    name: "North Dakota", 
    population: 672591
  },
  {
    name: "Ohio", 
    population: 11536504
  },
  {
    name: "Oklahoma", 
    population: 3751351
  },
  {
    name: "Oregon", 
    population: 3831074
  },
  {
    name: "Pennsylvania", 
    population: 12702379
  },
  {
    name: "Rhode Island", 
    population: 1052567
  },
  {
    name: "South Carolina", 
    population: 4625364
  },
  {
    name: "South Dakota", 
    population: 814180
  },
  {
    name: "Tennessee", 
    population: 6346105
  },
  {
    name: "Texas", 
    population: 25145561
  },
  {
    name: "Utah", 
    population: 2763885
  },
  {
    name: "Vermont", 
    population: 625741
  },
  {
    name: "Virginia", 
    population: 8001024
  },
  {
    name: "Washington", 
    population: 6724540
  },
  {
    name: "West Virginia", 
    population: 1852994
  },
  {
    name: "Wisconsin", 
    population: 5686986
  },
  {
    name: "Wyoming", 
    population: 563626}
]

class USMap extends Component {
  loadData() {

    const promises = []
    promises.push(d3.csv(`${process.env.PUBLIC_URL}/data/collegebyyear.csv`))
    promises.push(d3.csv(`${process.env.PUBLIC_URL}/data/censusbyyear.csv`))

    Promise.all(promises).then(([collegeData, censusData]) => {
      console.log('college data', collegeData)
      console.log('census data', censusData)
    })

    this.loadMap()
  }
  loadMap() {
    d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
      .then(mapData => {
        const geoDataObj = topojsonFeature(mapData, mapData.objects.states)
        console.log(geoDataObj)
        testStateData.forEach(row => {
          const states =  geoDataObj.features.filter(d => d.properties.name === row.name)
          states.forEach(state => state.properties = row)
        })
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

    d3.select('svg')
          .attr('width', width)
          .attr('height', height)
        .selectAll('.state')
        .data(geoDataObj.features)
        .enter()
          .append('path')
          .classed('state', true)
          .attr('d', path)

    setTimeout(() => {

      this.setColor()
    }, 1000)
  }
  setColor() {

    const colorRange = ['white', 'blue']

    const scale = d3.scaleLinear()
                    .domain([0, d3.max(testStateData.map(state => state.population))])
                    .range(colorRange)

    d3.selectAll('.state')
      .transition()
      .style('fill', d => {
        const data = d.properties.population
        return scale(data)
      })
  }
  componentDidMount() {
    this.loadData()
    // this.loadMap()
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