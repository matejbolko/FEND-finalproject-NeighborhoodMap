import React, { Component } from "react";
import "./Menu.css";
 
class Menu extends Component {
  constructor(props, context) {
    super(props, context);
   
    this.state = {
      visibility: true
    };
  }

updateDimensions() {
    // set state visibility (of sidebar) to true, if width>600 - look at mediaquery
    var x = document.getElementById("sidebarMenu")
    if(this.visibility && window.innerWidth < 600) {
      x.classList.add("hide")
      x.classList.remove("show")
      this.visibility = !this.visibility;

    // set state visibility (of sidebar) to false, if width<600 - look at mediaquery
    } else if (!this.visibility && window.innerWidth > 600) {
        x.classList.add("show")
        x.classList.remove("hide")
        this.visibility = !this.visibility
      }
    }

//https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
componentDidMount() {
  this.updateDimensions();
  window.addEventListener('resize', this.updateDimensions)
}

componentWillUnmount() {
  this.updateDimensions();
  window.removeEventListener('resize', this.updateDimensions)
}
  
  render() {
    return (
      <ol id="sidebarMenu"
          className="sidebarMenu"
          onMouseDown={this.props.handleMouseDown} 
          className={(this.props.menuVisibility ? 'show' : 'hide')} // button functionality hide/show
          onChange={this.handleChange}>
        <li><a href="#">Href one</a></li>
        <li><a href="#">Href two</a></li>
        <li><a href="#">Href three</a></li>
        <li><a href="#">Href four</a></li>
      </ol>
    );
  }
}
 
export default Menu;