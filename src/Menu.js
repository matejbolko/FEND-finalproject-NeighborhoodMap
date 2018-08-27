import React, { Component } from "react";
import "./Menu.css";
 
class Menu extends Component {
  constructor(props, context) {
    super(props, context);
   
    this.state = {
      visibility: true

    };
  }
  
  render() {
    return (
      <ul id="sidebarMenu"
          className="sidebarMenu"
          className={(this.props.menuVisibility ? 'show' : 'hide')} // button functionality hide/show
          onChange={this.handleChange}>
          {
              this.props.markers.map((m, i) =>
              (<li key={i}>{m.title}</li>))
            }
      </ul>
    );
  }
}
 
export default Menu;