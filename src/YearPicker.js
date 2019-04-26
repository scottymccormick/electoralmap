import React from 'react'

const YearPicker = props => {
  const years = []
  for (let year = 2000; year <= 2016; year += 2) {
    years.push(year)
  }
  return (
    <section>
      <input type="range" list="tickmarks" name="year" id="year-slider" className="slider" onChange={props.handleChange} min="2000" max="2016" step="2" defaultValue="2016"/>
      <datalist id="tickmarks">
        { years.map(year => {
          return <option value={year} label={year} key={year} />
        })}
      </datalist>
    </section>
  )
}

export default YearPicker