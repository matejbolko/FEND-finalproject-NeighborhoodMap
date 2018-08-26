import React, { Component } from "react";
import './MenuButton.css';

//https://www.kirupa.com/react/smooth_sliding_menu_react_motion.htm 
class MenuButton extends Component {
  render() {
    return (
      <button id="roundButton"
        onMouseDown={this.props.handleMouseDown}>&#9776;</button>
    );
  }
}
 
export default MenuButton;