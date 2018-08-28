import React, {Component} from 'react';
import MenuButton from './MenuButton'
import axios from 'axios'
import { config } from './Config.js'

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {
      locations: [
        { title: "Tromostovje", location: {lat: 46.051035201638676, lng: 14.506290315728124}, fsID: "4bb10df0f964a5204e763ce3", fsLikes: "0" },
        { title: "Prešernov trg", location: {lat: 46.051483462176165, lng: 14.506030082702637}, fsID: "4bb11095f964a52042773ce3", fsLikes: "0"},
        { title: "Kongresni trg", location: {lat: 46.05000356217219, lng: 14.504055976867676}, fsID: "4dea04ba18386283a3d94b83", fsLikes: "0"},
        { title: "Park Tivoli", location: {lat: 46.054530628239405, lng: 14.49695348739624}, fsID: "4bc09b384cdfc9b6f3139321", fsLikes: "0"},
        { title: "Ljubljanski grad", location: {lat: 46.04890127012711, lng: 14.508854288781148}, fsID: "4c28f25e9eb19521afa22959", fsLikes: "0" }
      ],
      query: '',
      markers: [],
      infowindow: new this.props.google.maps.InfoWindow(),
      center: {lat: 46.051035201638676, lng: 14.506290315728124},
      visible: true,
      venues: []
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  handleKeyPressMenu = (event) => {
    if(event.key === 'Enter'){
      this.toggleMenu();  
    }
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
    this.getFsNumOfLikes()
  }

  initMap() {
    if (this.props) {
      const {google} = this.props
      const maps = google.maps

      const mapCfg = Object.assign({}, {
        center: this.state.center,
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
        //center map and put clicked marker on center
        this.map.panTo(marker.getPosition());
        this.populateInfoWindow(marker, infowindow)
        //this.setState({center: this.state.locations[i].location })
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
      infowindow.setContent('<div class="infowindowsTitle">' + marker.title + '</div>' +
    '<div class="fqNumOfLikes">'+marker.fsLikes+' people likes this place</div>');
      
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
      //center map and put clicked marker on center
      this.map.panTo(markers[i].getPosition());
    }
    
    document.querySelector('.locations-list').addEventListener('click', function (event) {
      if(event.target && event.target.nodeName === "LI") {
        displayInfowindow(event)
      }
    })

    document.querySelector('.locations-list').addEventListener('keypress', function (event) {
      var key = event.which || event.keyCode;
      if(event.target && event.target.nodeName === "LI" && key === 13) {
        displayInfowindow(event)
      }
    })
  }

  onQueryChange = (event) => {
    this.setState({query: event.target.value})
  }

  getFsNumOfLikes = () => {
    this.state.locations.forEach(location => {
      this.getFsVenues(location.fsID)
    })
  }

  getFsVenues = (venue_ID) => {
    const endPoint = "https://api.foursquare.com/v2/venues/"+venue_ID+"/likes?"
    const parameters = {
      client_id: config.FS_client_id,
      client_secret: config.FS_client_secret,
      v: "20180828"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      let likes = response.data.response.likes.count
      for (var i=0; i<this.state.locations.length; i++){
        if (this.state.locations[i].fsID === venue_ID){
          this.setState((state) => ({...state.locations[i].fsLikes = likes}))
          this.setState((state) => ({...state.markers[i].fsLikes = likes}))
        }
      }
      
      //this.setState({venues: [...this.state.venues, {fsID: venue_ID,likes: likes}]})
    }).catch(error => {
      alert("We are sorry, but foursquare returned error: \n"+error);
    })
  }


  render() {
    const hideClass = this.state.visible ? 'show' : 'hide'
    const ariaHidden = this.state.visible ? 'false' : 'true'
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
        <nav aria-labelledby="navigationbutton">
          <MenuButton handleMouseDown={this.handleMouseDown}
            handleKeyPressMenu={this.handleKeyPressMenu}/>
        </nav>
        <div className="mainContainer">
          <div className={classes}
               id = "sidebarMenu"
               arria-hidden= {ariaHidden}
               aria-label="Menu Bar"
               onChange={this.handleChange}
          >
            <input role="search" type='text' 
                   aria-label="search field"
                   value={this.state.value}
                   onChange={this.onQueryChange} 
            />
            <ul className="locations-list">{
              this.state.markers.filter(marker => 
                marker.getVisible()).map((marker, i) =>
                (<li key={i} tabIndex="0">{marker.title}</li>))
            }</ul>
          </div> {/* end of div className={classes} */}
          <div className="Main" aria-labelledby="map">
            <div role="application" id="map" className="map" arria-hidden="true" tabIndex="-1">
              Please wait. Loading map ...
            </div>  
          </div> {/* end of Main */}
        </div> {/* end of mainContainer */}
      </div> // end of Container
    )
  }
}