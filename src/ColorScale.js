import React from 'react'

const ColorScale = props => {
  return (
    <div className="color-scale-container">
      <h4>Vote Strength</h4>
      <div className="color-scale">
        <ul>
          <li>2.0&#60;</li>
          <li>1.0</li>
          <li> &#60;0.5</li>
        </ul>
      </div>
    </div>
  )
}

export default ColorScale