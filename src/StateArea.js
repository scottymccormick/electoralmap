import React, { Component } from 'react'

class StateArea extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.selectedState.name}</h3>
        <button className="close-state-section-btn" onClick={this.props.closeStateBtn}>Close State Section</button>
      </div>
    )
  }
}

export default StateArea