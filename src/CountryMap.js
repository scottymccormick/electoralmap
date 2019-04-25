import React from 'react'
import * as d3 from 'd3'
import topoStates from './states'
import {feature as topojsonFeature} from 'topojson'

const CountryMap = props => {

  const geoDataObj = topojsonFeature(topoStates, topoStates.objects.states)

  props.strengthScores.forEach(row => {
    const states =  geoDataObj.features.filter(d => d.properties.name === row.name)
    states.forEach(state => state.properties = row)
  })

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

  const scale = d3.scaleLinear()
                  .domain([0.5, 1, 3])
                  .range(['red', '#FFFDE9', 'blue'])

  d3.selectAll('.state')
    .transition()
    .duration(500)
    .style('fill', d => {
      const data = d.properties.score
      return data ? scale(data) : '#aaa'
    })

  return (
    <div>
      <h2>test</h2>
      <svg 
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
  )
}

export default CountryMap