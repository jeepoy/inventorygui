import React, { Component } from 'react';
import { Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import ProductGrid from "./ProductGrid";
import ProductForm from './ProductForm';

class ProductScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productId: 0,
            action: '',
            tabKey: 'proList'            
        };

    }

    setProductId = (prodId) => { 
        this.setState({ productId: prodId});         
    }   

    setTabKey = (keyForTab) => {
        this.setState({ tabKey: keyForTab}); 
    }   

    setAction = (updateAction) => {
        this.setState({ action: updateAction}); 
    }   

    render() {
        return (
            <Container fluid>
                <Tabs activeKey={this.state.tabKey} onSelect={tabKey => this.setState({ tabKey, productId: 0, action: "add" })}  id="controlled-tab">
                    <Tab eventKey="proList" title="Product Listing" onEnter={ () => this.setProductId(undefined)}>
                        <br/>
                        <ProductGrid setTabKey={this.setTabKey} setProductId={this.setProductId} setAction={this.setAction} />
                    </Tab>
                    <Tab eventKey="proEntry" title="Product Entry" >
                        <br/>
                        <ProductForm action={this.state.action} productId={this.state.productId}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default ProductScreen;
