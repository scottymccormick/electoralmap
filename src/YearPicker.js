import React from 'react'

const YearPicker = props => {
  const years = []
  for (let year = 1788; year <= 2016; year += 20) {
    years.push(year)
  }
  years.push(2016)
  return (
    <section>
      <input type="range" list="tickmarks" name="year" id="year-slider" className="slider" onChange={props.handleChange} min="1788" max="2016" step="2" defaultValue="2016"/>
      <datalist id="tickmarks">
        { years.map(year => {
          return <option value={year} label={(year === 1788 || year === 2016) ? year : ''} key={year} />
        })}
      </datalist>
    </section>
  )
}

export default YearPicker