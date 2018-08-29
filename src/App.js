import React, { Component } from 'react';
import './App.css';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import { config } from './Config'

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">My Neighborhood</h1>
        </header>
        <MapContainer google={this.props.google} />
      </div> // end of App
    );
  }
}
window.addEventListener("unhandledrejection", function (event) {
  alert("WARNING: We couldn't load google maps "
               + event.reason);
});

export default GoogleApiWrapper({
  apiKey: config.myGoogleMapsToken
})(App)