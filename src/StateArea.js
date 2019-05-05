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
  getStrengthScores(census, votes) {

    const scores = []
    for (let i = 0; i < votes.length; i++) {
      const collegeYear = votes[i]
      const censusYear = census.find(entry => {
        return entry.year === collegeYear.year ||
          (entry.year === 1790 && collegeYear.year === 1788) || // edge case for 1790
          (Math.abs(entry.year - collegeYear.year) < 10 && entry.year < collegeYear.year)
      })
      if (collegeYear.votes === 0 || censusYear.population === 0) {
        scores.push({
          year: collegeYear.year,
          score: 0
        })
      } else { 
        const score = (collegeYear.votes / this.props.voteTotal) / (censusYear.population / this.props.popTotal)
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

    const x = d3.scaleTime()
      .range([0, 600])
      .domain(d3.extent(this.state.strengthScores, function(d) {
        return d.year
      }))
    const y = d3.scaleLinear()
      .range([90, 0])
      .domain(d3.extent(this.state.strengthScores, function(d) {
        return d.score
      }))

    const lineGenerator = d3.line()
        .x(function(d) { return x(d.year)})
        .y(function(d) { return y(d.score)})
  
    const pathData = lineGenerator(this.state.strengthScores)

    const svg = d3.select("#stateSvg")
      .append("g")
      .attr("transform", "translate(30, 30)");

    d3.select('#stateSvg path')
      .attr('d', pathData)

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedState.name !== this.props.selectedState.name) {
      this.calculateScores()
      // this.constructSvg()
    }
  }
  componentDidMount() {
    this.calculateScores()
  }
  render() {
    return (
      <div>
        <h3>{this.props.selectedState.name}</h3>
        <button className="close-state-section-btn" onClick={this.props.closeStateBtn}>Close State Section</button>
        {this.state.strengthScores.length > 0 ? 
          <div>
            <svg 
              id="stateSvg"
              width="700"
              height="210"
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