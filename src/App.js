import React, { Component } from 'react';
import AppNav from './AppParts/AppNav';
import AppBody from './AppParts/AppBody';

class App extends Component {

  render() {
    return (
      <div>
        <AppNav />
        <br/>
        <AppBody />
      </div>
    );
  }
}

export default App;
