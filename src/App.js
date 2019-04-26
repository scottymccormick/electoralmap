import React, { Component } from 'react';
import './App.css';
import MapArea from './MapArea';
import Header from './Header';
import Education from './Education';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <MapArea />
        <Education />
        <Footer />
      </div>
    );
  }
}

export default App;
