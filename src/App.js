import React, { Component } from 'react';
import './App.css';
import MapArea from './MapArea';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <MapArea />
      </div>
    );
  }
}

export default App;
