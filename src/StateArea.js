import React, { Component } from 'react'
import * as d3 from 'd3'

class StateArea extends Component {
  constructor() {
    super()

    this.state = {
      strengthScores: []
    }
  }
  getStateData() {
    const stateCensus = this.props.censusData.map(entry => {
      return {
        year: entry.year,
        population: entry.states.find(state => state.name === this.props.selectedState.name).population
      }
    })
    const stateVotes = this.props.collegeData.map(entry => {
      return {
        year: entry.year,
        votes: entry.states.find(state => state.name === this.props.selectedState.name).votes
      }
    })
    return [stateCensus, stateVotes]
  }
  getPopTotals(year) {
    // pop totals
    const collegeYearPop = this.props.collegeData.find(entry => {
      return entry.year === year || 
      (Math.abs(entry.year - year) <= 2 && entry.year < year)
    })
    
    const censusYearPop = this.props.censusData.find(entry => {
      return entry.year === year ||
      (entry.year === 1790 && year === 1788) || // edge case for 1790
      (Math.abs(entry.year - year) < 10 && entry.year < year)
    })
    
    let popTotal = 0
    censusYearPop.states.forEach(state => {
      popTotal += state.population
    })
    let voteTotal = 0
    collegeYearPop.states.forEach(state => {
      voteTotal += state.votes
    })

    return [popTotal, voteTotal]
  }
  getStrengthScores(census, votes) {

    const scores = []
    for (let i = 0; i < votes.length; i++) {
      const collegeYear = votes[i]
      const censusYear = census.find(entry => {
        return entry.year === collegeYear.year ||
          (entry.year === 1790 && collegeYear.year === 1788) || // edge case for 1790
          (Math.abs(entry.year - collegeYear.year) < 10 && entry.year < collegeYear.year)
      })

      // get pop totals
      const [popTotal, voteTotal] = this.getPopTotals(collegeYear.year)

      if (collegeYear.votes === 0 || censusYear.population === 0) {
        scores.push({
          year: collegeYear.year,
          score: 0
        })
      } else { 
        const score = (collegeYear.votes / voteTotal) / (censusYear.population / popTotal)
        scores.push({
          year: collegeYear.year,
          score
        })
      }
    }
    return scores
  }
  calculateScores = async () => {
    const [stateCensus, stateVotes] = this.getStateData()
    const strengthScores = this.getStrengthScores(stateCensus, stateVotes)
    await this.setState({
      strengthScores
    })
    this.constructSvg()
  }
  constructSvg() {

    const margin = {top: 30, right: 30, bottom: 30, left: 30}
    const width = 700 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const filteredData = this.state.strengthScores.filter(entry => entry.score > 0)

    d3.select('#stateSvg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    const xScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, function(d) {
        return d.year
      }))
      .range([0, width])
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.extent(filteredData, function(d) {
        return d.score
      })[1]])
      .range([height, 0])

    const lineGenerator = d3.line()
        .x(function(d) { return xScale(d.year)})
        .y(function(d) { return yScale(d.score)})
  
    const pathData = lineGenerator(filteredData)
    
    const svg = d3.select("#stateSvg")
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
      
    // Add the X Axis
    const xAxis = d3.axisBottom(xScale)
                      .tickFormat(function(d) {return Number(d)})

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    
    // Add the Y Axis
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append('path')
      .attr('class', 'line')
      .attr('d', pathData)
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedState.name !== this.props.selectedState.name) {
      d3.select('#stateSvg g').remove()
      this.calculateScores()
    }
  }
  componentDidMount() {
    this.calculateScores()
  }
  render() {
    return (
      <div>
        <h3>{this.props.selectedState.name} - State Analysis (Beta)</h3>
        <button className="close-state-section-btn" onClick={this.props.closeStateBtn}>Close State Section</button>
        {this.state.strengthScores.length > 0 ? 
          <div id="stateSvgContainer">
            <svg 
              id="stateSvg"
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg">
              <path></path>
            </svg>

            {this.state.strengthScores.map(entry => {
              return (
                <div key={entry.year}>
                  <p>Year: {entry.year} Score: {entry.score}</p>
                </div>
              )
            })}
          </div>
          
          : null }
      </div>
    )
  }
}

export default StateArea