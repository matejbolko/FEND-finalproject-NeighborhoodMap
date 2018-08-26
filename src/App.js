import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MenuButton from './MenuButton'
import Menu from './Menu'

class App extends Component {
  constructor(props, context) {
    super(props, context);
   
    this.state = {
      visible: true
    };
   
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">My Neighborhood</h1>
          <MenuButton handleMouseDown={this.handleMouseDown}/>
        </header>

        <div className="Container">
          <Menu handleMouseDown={this.handleMouseDown}
          menuVisibility={this.state.visible}
        />
          <div className="Main">
            <p>Just a sample of text</p>
            <ul>
              <li>Lorem</li>
              <li>Ipsum</li>
              <li>dummy</li>
              <li>text</li>
              <li>printing</li>
              <li>inductry</li>
              <li>electronic</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
