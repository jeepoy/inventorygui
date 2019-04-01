import React, { Component } from 'react';
import { Navbar, Button, ButtonToolbar } from 'react-bootstrap';
import logo from './../logo.svg';

const btnMargins = {
  marginLeft: 10,
  marginRight: 20,
  marginBottom: 2
}

class AppNav extends Component {
  render() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
              <Navbar.Brand href="#home">
                  <img alt="" src={ logo } width="30" height="30" className="d-inline-block align-top" />
                  {'Hardware Inventory'}
              </Navbar.Brand>
            <Navbar.Toggle aria-controls="buttons" />
            <Navbar.Collapse id="basic-navbar-nav">
              <ButtonToolbar>
                <Button variant="primary" size="sm" style={btnMargins}>Products</Button>
                <Button variant="primary" size="sm" style={btnMargins}>Purchases</Button>
                <Button variant="primary" size="sm" style={btnMargins}>Sales</Button>
                <Button variant="primary" size="sm" style={btnMargins}>Supplier</Button>
                <Button variant="primary" size="sm" style={btnMargins}>Reports</Button>
              </ButtonToolbar>
            </Navbar.Collapse>
        </Navbar>
    );
  }

}

export default AppNav;
