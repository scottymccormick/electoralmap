import React from 'react'

const ColorScale = props => {
  return (
    <div className="color-scale-container">
      <h5>Vote Strength</h5>
      <div className="color-scale">
        <ul>
          <li> &#60;0.5</li>
          <li>1.0</li>
          <li>2.0&#60;</li>
        </ul>
      </div>
    </div>
  )
}

export default ColorScale