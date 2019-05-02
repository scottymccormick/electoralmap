import React, { Component } from 'react'
import * as d3 from 'd3'
import YearPicker from './YearPicker';
import CountryMap from './CountryMap';
import ColorScale from './ColorScale';
import DataArea from './DataArea';

class MapArea extends Component {
  constructor() {
    super()

    this.state = {
      year: 2016,
      censusData: [],
      collegeData: [],
      strengthScores: [],
      popTotal: 0,
      voteTotal: 0,
      selectedState: null,
      showStateSection: false,
      stateSectionClass: 'state-section'
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

  // Read in data from csv files
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
  }
  async refreshScores() {
    const [ collegeYear, censusYear ] = this.getData()
    await this.setState({
      strengthScores: this.getScores(collegeYear, censusYear)
    })
  }
  // retrieve census and college data for the specified year
  getData() {
    const collegeYear = this.state.collegeData.find(entry => {
      return entry.year === this.state.year || 
        (Math.abs(entry.year - this.state.year) <= 2 && entry.year < this.state.year)
    })

    const censusYear = this.state.censusData.find(entry => {
      return entry.year === this.state.year ||
        (entry.year === 1790 && this.state.year === 1788) || // edge case for 1790
        (Math.abs(entry.year - this.state.year) < 10 && entry.year < this.state.year)
    })
    return [collegeYear, censusYear]
  }
  // calculate scores based on data
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

    this.setState({
      popTotal, voteTotal
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
  selectState = (name = this.state.selectedState.name) => {
    const [ collegeYear, censusYear ] = this.getData()
    const stateCensus = censusYear.states.find(state => state.name === name)
    const stateCollege = collegeYear.states.find(state => state.name === name)
    const stateStrength = this.state.strengthScores.find(state => state.name === name)
    
    this.setState({
      selectedState: {
        name,
        population: stateCensus.population || 'No Data',
        votes: stateCollege.votes,
        strength: stateCollege.votes ? stateStrength.score : 'N/A'
      }
    })
  }
  handleChange = async e => {
    await this.setState({
      [e.target.name]: +e.target.value
    })
    await this.refreshScores()
    if (this.state.selectedState) {
      this.selectState()
    }
  }
  stateBtnClick = e => {
    console.log('Clicked on state btn')
    
    this.setState({ 
      showStateSection: true,
      stateSectionClass: 'state-section active-state-section'
    })
  }
  closeStateBtn = () => {
    this.setState({ 
      showStateSection: false,
      stateSectionClass: 'state-section'
    })
  }
  componentDidMount() {
    this.loadData()
  }
  render() {
    console.log(this.state)
    return (
      <div>
      <section className="map-section">
        <h3>{this.state.year}</h3>
        <YearPicker handleChange={this.handleChange} />
        <div className="map-area">
          <ColorScale />
          <CountryMap strengthScores={this.state.strengthScores} selectState={this.selectState} />
          <DataArea popTotal={this.state.popTotal} voteTotal={this.state.voteTotal} selectedState={this.state.selectedState} year={this.state.year} stateBtnClick={this.stateBtnClick} />
        </div>
      </section>
        <section className={this.state.stateSectionClass}>
      { this.state.showStateSection ?
          (
            <div>
              <h3>{this.state.selectedState.name}</h3>
              <button className="close-state-section-btn" onClick={this.closeStateBtn}>Close State Section</button>
            </div>
          )
          : null}
        </section>
      </div>
    )
  }
}

export default MapArea