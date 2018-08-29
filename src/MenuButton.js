import React, { Component } from "react";
import './MenuButton.css';

//https://www.kirupa.com/react/smooth_sliding_menu_react_motion.htm 
class MenuButton extends Component {
  render() {
    return (
      <button id="navigationbutton" tabIndex="0" aria-label="menu"
        onMouseDown={this.props.handleMouseDown}
        onKeyPress={this.props.handleKeyPressMenu}
      >&#9776;</button>
    );
  }
}
 
export default MenuButton;