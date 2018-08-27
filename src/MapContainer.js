import React, {Component} from 'react';
import MenuButton from './MenuButton'

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      locations: [
        { title: "Triple Bridge", location: {lat: 46.0511374, lng: 14.5062348} },
        { title: "Prešeren square", location: {lat: 46.051433, lng: 14.5059673} },
        { title: "Congress Square", location: {lat: 46.0502077, lng: 14.5036985} },
        { title: "City Park Tivoli", location: {lat: 46.0547165, lng: 14.4948117} },
        { title: "Ljubljana Castle", location: {lat: 46.0489668, lng: 14.5084904} }
      ],
      query: '',
      markers: [],
      infowindow: new this.props.google.maps.InfoWindow(),
      visible: true
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  //sidemenu components 
  handleMouseDown(e) {
    this.toggleMenu();
 
    console.log("clicked");
    e.stopPropagation();
  }

  toggleMenu() {
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }

  //google maps components
  componentDidMount() {
    this.loadMap()
    this.onclickLocation()
  }

  loadMap() {
    if (this.props) {
      const {google} = this.props
      const maps = google.maps

      const mapCfg = Object.assign({}, {
        center: {lat: 46.0511449, lng: 14.5040679},
        zoom: 11
      })

      // https://developers.google.com/maps/documentation/javascript/tutorial
      this.map = new maps.Map(document.getElementById('map'), mapCfg)
      this.addMarkers()
    }
  }

  addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    var bounds = new google.maps.LatLngBounds(); // https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds

    // get over state.locations and create Marker for each location
    for (var i = 0; i < this.state.locations.length; i++) {
      var position = this.state.locations[i].location;
      var title = this.state.locations[i].title;
      const marker = new google.maps.Marker({
        position: {lat: position.lat, lng: position.lng},
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
        map: this.map
      })

      // add click listener to marker and display info window
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
      })
      // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    }
    this.map.fitBounds(bounds)
  }

  populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  onclickLocation = () => {
    const that = this
    const {infowindow} = this.state
    const displayInfowindow = (e) => {
      const {markers} = this.state
      const markerInd = markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
      that.populateInfoWindow(markers[markerInd], infowindow)
    }
    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if(e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })
  }

  render() {
    const hideClass = this.state.visible ? 'show' : 'hide'
    const classes = `sidebarMenu ${hideClass}`
    return (
      <div className="Container">
        <nav>
          <MenuButton handleMouseDown={this.handleMouseDown}/>
        </nav>
        <div className="mainContainer">
          <div className={classes}
          id = "sidebarMenu"
            onChange={this.handleChange}
          >
            <ul className="locations-list">{
              this.state.markers.map((m, i) =>
                (<li key={i}>{m.title}</li>))
            }</ul>
          </div>
          <div className="Main">
            <div role="application" id="map" className="map">
              Please wait. Loading map ...
            </div>  
          </div>{ /* end of Main */ }
        </div>
      </div> // end of Container
    )
  }
}