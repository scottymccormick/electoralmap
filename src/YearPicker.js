import React from 'react'

const YearPicker = props => {
  return (
    <section>
      <input type="range" name="year" id="year-slider" min="1790" max="2016" step="2" onChange={props.handleChange}/>
    </section>
  )
}

export default YearPicker