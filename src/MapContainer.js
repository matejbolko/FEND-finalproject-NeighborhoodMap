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
    this.initMap()
    this.onSideMenuLocationClick()
  }

  initMap() {
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

  // transformed code from Udacity Project_Code_4_WindowShoppingPart2.html
  addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    var bounds = new google.maps.LatLngBounds(); // https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds

    // get over state.locations and create Marker for each location
    for (var i = 0; i < this.state.locations.length; i++) {
      // Get the position from the location array.
      var position = this.state.locations[i].location;
      var title = this.state.locations[i].title;
      // Create a marker per location, and put into markers array.
      const marker = new google.maps.Marker({
        position: {lat: position.lat, lng: position.lng},
        title: title,
        animation: google.maps.Animation.DROP,
        id: i,
        map: this.map
      })

      // Create an onclick event to open an infowindow at each marker.
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

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
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

  onSideMenuLocationClick = () => {
    const displayInfowindow = (event) => {
      const {markers} = this.state
      // compare title of marker and sidebar tile - get index i of the marker and display infoWindows
      const i = markers.findIndex(marker => 
        marker.title.toLowerCase() === event.target.innerText.toLowerCase())
      this.populateInfoWindow(markers[i], this.state.infowindow)
      markers[i].setAnimation(this.props.google.maps.Animation.BOUNCE);
      // remove animation after 2seconds
      setTimeout(function () {
        markers[i].setAnimation(null);
      }, 2000);
    }
    
    document.querySelector('.locations-list').addEventListener('click', function (event) {
      if(event.target && event.target.nodeName === "LI") {
        displayInfowindow(event)
      }
    })
  }

  onQueryChange = (event) => {
    this.setState({query: event.target.value})
  }

  render() {
    const hideClass = this.state.visible ? 'show' : 'hide'
    const classes = `sidebarMenu ${hideClass}`
    const { locations } = this.state
    const { markers } = this.state

    if (this.state.query) {
      for (var i=0; i<locations.length; i++) {
        if(locations[i].title.toLowerCase().includes(this.state.query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          if (this.state.infowindow.marker === markers[i]){
            // close the info window if marker removed
            this.state.infowindow.close()
          }
          markers[i].setVisible(false)
        }
      }
    } else {
      for (i=0; i<markers.length; i++) {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      }
    }

    return (
      <div className="Container">
        <nav>
          <MenuButton handleMouseDown={this.handleMouseDown}/>
        </nav>
        <div className="mainContainer">
          <div className={classes}
               id = "sidebarMenu"
               onChange={this.handleChange}>
            <input role="search" type='text' 
                   value={this.state.value}
                   onChange={this.onQueryChange} 
            />
            <ul className="locations-list">{
              this.state.markers.filter(marker => 
                marker.getVisible()).map((marker, i) =>
                (<li key={i}>{marker.title}</li>))
            }</ul>
          </div> {/* end of div className={classes} */}
          <div className="Main">
            <div role="application" id="map" className="map">
              Please wait. Loading map ...
            </div>  
          </div> {/* end of Main */}
        </div> {/* end of mainContainer */}
      </div> // end of Container
    )
  }
}