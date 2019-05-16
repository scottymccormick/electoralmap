import React from 'react'

const DataArea = props => {
  return (
    <section className="data-area">
      <h4>By the Numbers</h4>
      <ul>
        <li>Electoral Votes: <strong>{props.voteTotal}</strong></li>
        <li>Population: <strong>{props.popTotal.toLocaleString()}</strong></li>
      </ul>

      { props.selectedState ?
        <div className="state-data-area">
          <h4>{props.selectedState.name} ({props.year})</h4>
          <ul>
            <li>Electoral Votes: <strong>{props.selectedState.votes}</strong></li>
            <li>Population: <strong>{props.selectedState.population.toLocaleString()}</strong></li>
            <li>Strength Score: <strong>{
                isNaN(props.selectedState.strength) ? props.selectedState.strength : props.selectedState.strength.toFixed(2)}</strong></li>
          </ul>
          <button className="state-analysis-btn" onClick={props.stateBtnClick}>View State Analysis</button>
        </div>
        : 
        <div className="state-data-announcement">
          <h4>Select a state to see additional details</h4>
        </div>
          }
    </section>
  )
}

export default DataArea