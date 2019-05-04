import React, { Component } from 'react'

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
  calculateScores () {
    const [stateCensus, stateVotes] = this.getStateData()
    const strengthScores = this.getStrengthScores(stateCensus, stateVotes)
    this.setState({
      strengthScores
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedState.name !== this.props.selectedState.name) {
      this.calculateScores()  
    }
  }
  componentDidMount() {
    this.calculateScores()
  }
  render() {
    console.log(this.state)
    return (
      <div>
        <h3>{this.props.selectedState.name}</h3>
        <button className="close-state-section-btn" onClick={this.props.closeStateBtn}>Close State Section</button>
        {this.state.strengthScores.length > 0 ? 
          this.state.strengthScores.map(entry => {
            return (
              <div key={entry.year}>
                <p>Year: {entry.year} Score: {entry.score}</p>
              </div>
            )
          })
          : null }
      </div>
    )
  }
}

export default StateArea