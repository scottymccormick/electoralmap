import React from 'react'

const DataArea = props => {
  return (
    <section className="data-area">
      <h4>By the Numbers</h4>
      <ul>
        <li>Electoral Votes: <strong>{props.voteTotal}</strong></li>
        <li>Population: <strong>{props.popTotal.toLocaleString()}</strong></li>
      </ul>
    </section>
  )
}

export default DataArea