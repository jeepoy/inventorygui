import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import logo from './../logo.svg';
import ProductScreen from "./Products/ProductScreen";
import CategoryScreen from "./Categories/CategoryScreen";
import PurchaseScreen from "./Purchases/PurchaseScreen";
import SupplierScreen from "./Suppliers/SupplierScreen";

class InventoryMainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideProducts:  true,
            hidePurchases: true,
            hideSales: true,            
            hideCategories: true,
            hideSuppliers: true,
            hideReports: true
        };

    }

    toggleForms = (formName) => {

        //Reset All Forms to be hidden
        this.setState({
           hideProducts: (formName === "Products") ? false : true,
           hidePurchases: (formName === "Purchases") ? false : true,
           hideSales: (formName === "Sales") ? false : true,
           hideCategories: (formName === "Categories") ? false : true,
           hideSuppliers: (formName === "Suppliers") ? false : true, 
           hideReports: (formName === "Reports") ? false : true}) ;

    }


  render() {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">
                    <img alt="" src={ logo } width="30" height="30" className="d-inline-block align-top" />
                    {'Hardware Inventory'}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="buttons" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                        <Nav.Link onSelect={() => this.toggleForms("Products")} href="#Products">Products</Nav.Link>
                        <Nav.Link onSelect={() => this.toggleForms("Categories")} href="#Categories">Categories</Nav.Link>
                        <Nav.Link onSelect={() => this.toggleForms("Purchases")} href="#Purchases">Purchases</Nav.Link>
                        <Nav.Link onSelect={() => this.toggleForms("Suppliers")} href="#Suppliers">Suppliers</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <br/>            
            <div hidden={this.state.hideProducts}>
                <ProductScreen />
            </div>
            <div hidden={this.state.hideCategories}>
                <CategoryScreen />
            </div>
            <div hidden={this.state.hidePurchases}>
                <PurchaseScreen />
            </div>
            <div hidden={this.state.hideSuppliers}>
                <SupplierScreen />
            </div>
        </div>
    );
  }

}

export default InventoryMainMenu;

