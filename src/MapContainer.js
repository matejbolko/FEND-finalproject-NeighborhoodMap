import React, {Component} from 'react';

export default class MapContainer extends Component {

  componentDidMount() {
    this.loadMap()
  }

  loadMap() {
    if (this.props) {
      const {google} = this.props
      const maps = google.maps

      const mapCfg = Object.assign({}, {
        center: {lat: 46.0521003, lng: 14.5090674},
        zoom: 13,
      })

      // https://developers.google.com/maps/documentation/javascript/tutorial
      this.map = new maps.Map(document.getElementById('map'), mapCfg)
    }
  }

  render() {
    return (
      <div role="application" id="map" className="map">
        Please wait. Loading map ...
      </div>
    )
  }
}