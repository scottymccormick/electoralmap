import React, { Component } from 'react'
import {feature as topojsonFeature} from 'topojson'
import * as d3 from 'd3'
import YearPicker from './YearPicker';
import topoStates from './states'

class USMap extends Component {
  constructor() {
    super()

    this.state = {
      year: 2016,
      censusData: [],
      collegeData: []
    }
  }
  censusFormatter = row => {
    const year = row['Year']
    const result = {
      year: +year,
      states: []
    }
    for (const key in row) {
      if (key !== 'Year') {
        result.states.push({
          name: key,
          population: +row[key]
        })
      }
    }
    return result
  }
  collegeFormatter = row => {
    const year = row['Year']
    const result = {
      year: +year,
      states: []
    }
    for (const key in row) {
      if (key !== 'Year') {
        result.states.push({
          name: key,
          votes: +row[key]
        })
      }
    }
    return result
  }
  loadData() {

    const promises = []
    promises.push(d3.csv(`${process.env.PUBLIC_URL}/data/collegebyyear.csv`, this.collegeFormatter))
    promises.push(d3.csv(`${process.env.PUBLIC_URL}/data/censusbyyear.csv`, this.censusFormatter))

    Promise.all(promises)
      .then(([collegeData, censusData]) => {
        this.setState({
          censusData,
          collegeData
        })
      })
      .then(() => this.refreshScores())
      .then(() => this.loadMap())
  }
  getData() {
    const collegeYear = this.state.collegeData.find(entry => {
      return entry.year === this.state.year || 
        (Math.abs(entry.year - this.state.year) <= 2 && entry.year < this.state.year)
    })

    const censusYear = this.state.censusData.find(entry => {
      return entry.year === this.state.year
    })
    return [collegeYear, censusYear]
  }
  loadMap() {

    const geoDataObj = topojsonFeature(topoStates, topoStates.objects.states)

    this.state.strengthScores.forEach(row => {
      const states =  geoDataObj.features.filter(d => d.properties.name === row.name)
      states.forEach(state => state.properties = row)
    })
    this.displayMap(geoDataObj)

    // d3.json('https://cdn.jsdelivr.net/npm/us-atlas@2/us/states-10m.json')
    //   .then(mapData => {
    //     const geoDataObj = topojsonFeature(mapData, mapData.objects.states)

    //     this.state.strengthScores.forEach(row => {
    //       const states =  geoDataObj.features.filter(d => d.properties.name === row.name)
    //       states.forEach(state => state.properties = row)
    //     })
    //     // testStateData.forEach(row => {
    //     //   const states =  geoDataObj.features.filter(d => d.properties.name === row.name)
    //     //   states.forEach(state => state.properties = row)
    //     // })
    //     this.displayMap(geoDataObj)
    //   })
    //   .catch(err => {
    //     throw err
    //   })
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

    this.setColor()
  }
  getScores(collegeYear, censusYear) {
    const strengthScores = []
    let popTotal = 0
    censusYear.states.forEach(state => {
      popTotal += state.population
    })
    let voteTotal = 0
    collegeYear.states.forEach(state => {
      voteTotal += state.votes
    })

    for (let i = 0; i < censusYear.states.length; i++) {
      const stateCensus = censusYear.states[i];
      const stateCollege = collegeYear.states.find(state => state.name === stateCensus.name)
      const score = (stateCollege.votes / voteTotal) / (stateCensus.population / popTotal)
      strengthScores.push({
        name: stateCensus.name,
        score
      })
    }
    return strengthScores
  }
  async setColor () {

    // const colorRange = ['#c4e7fd', 'blue']
    // const colorDomain = d3.extent(this.state.strengthScores.map(state => state.score))
    const scale = d3.scaleLinear()
                    .domain([0.5, 1, 4])
                    .range(['red', '#FFFDE9', 'blue'])

    d3.selectAll('.state')
      .transition()
      .duration(500)
      .style('fill', d => {
        const data = d.properties.score
        return data ? scale(data) : '#aaa'
      })
  }
  async refreshScores() {
    const [ collegeYear, censusYear ] =  await this.getData()

    await this.setState({
      strengthScores: this.getScores(collegeYear, censusYear)
    })
    this.loadMap()
  }
  handleChange = async e => {
    await this.setState({
      [e.target.name]: +e.target.value
    })
    await this.refreshScores()
  }
  componentDidMount() {
    this.loadData()
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <h3>US Map</h3>
        <YearPicker handleChange={this.handleChange} />
        <svg 
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    )
  }
}

export default USMap