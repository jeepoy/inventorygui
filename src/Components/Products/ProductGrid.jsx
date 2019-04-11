import React, { Component } from 'react';
import { Spinner, Modal, Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert, ButtonToolbar, InputGroup } from 'react-bootstrap';
import { properties } from './../properties';


class ProductGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            errorMessage: "",
            infoMessage: "",
            loading: true,            
            showDeleteModal: false,
            productToDelete: "",
            rootUrl: properties.rootUrl
        };
        this.loadGridData();  
    }

    loadGridData = () => {

        this.setState({errorMessage: "", loading: true});

        fetch(this.state.rootUrl + '/product/all/')        
        .then(response => response.json())
        .then(data => this.setState({products: data,errorMessage: "", loading: false, infoMessage: this.loadMessage()}))
        .catch(error => this.setState({errorMessage : error.message, loading: false, infoMessage: ""}))
        
        console.log("grid loaded.")        
        console.log(this.state.loading);

    }

    loadMessage= () => {
        var date = new Date();
        var hours = date.getHours();
        var days = date.getDay(); 
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        seconds = seconds < 10 ? '0'+seconds : seconds;

        return  'Successfully refreshed data at ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;        
    }


    handleEdit = (id) => {
        this.props.setTabKey("proEntry");
        this.props.setProductId(id);
        this.props.setAction("edit");
    }

    handleDelete = (product) => {
        this.setState({showDeleteModal: true})
        this.setState({productToDelete: product})
    }

    deleteProduct = (product) => {

        fetch(this.state.rootUrl + '/product/delete/'+ product.id) 
       .catch(error => this.setState({errorMessage : error.message}))
       
       this.loadGridData();
       this.setState({showDeleteModal: false})
    }


    render() {
        return (
            <div>                
                <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">                    
                    <Spinner animation="border" hidden={!this.state.loading} />
                    <h7 style={{color:"red"}} hidden={!this.state.errorMessage}>{this.state.errorMessage}</h7>                    
                    <h7 style={{color:"green"}}>{this.state.infoMessage}</h7>                    
                    <Button size="sm" variant="success"  onClick={() => this.loadGridData()} >Refresh</Button>       
                </ButtonToolbar>
                <br/>
                <Table striped bordered hover responsive size="sm" >
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Name</th>
                            <th>Part #</th>
                            <th>Category</th>
                            <th>Min Required</th>
                            <th>Starting</th>
                            <th>Purchased</th>
                            <th>Sold</th>
                            <th>OnHand</th>                        
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            this.state.products.map( (product, i) =>
                                <tr key={i}>
                                    <td>{product.id}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.partNumber}</td>
                                    <td>{product.productLabel}</td>
                                    <td>{product.minimumRequired}</td>
                                    <td>{product.startingInventory}</td>
                                    <td>{product.inventoryReceived}</td>
                                    <td>{product.inventorySold}</td>
                                    <td>{product.inventoryOnHand}</td>                                
                                    <td>
                                        <Button variant="primary" size="sm" onClick={() => this.handleEdit(product.id)} ><i id={product.id} className="fas fa-pen"></i></Button> 
                                        <Button variant="danger" size="sm" onClick={() => this.handleDelete(product)} ><i id={product.id} className="far fa-trash-alt"></i></Button>
                                    </td>
                                </tr>
                            ) 
                        }
                    </tbody>
                </Table>
                
                <Modal show={this.state.showDeleteModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{"You are about to delete Product with Part Number: " + this.state.productToDelete.partNumber}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>Cancel</Button>
                        <Button variant="primary" onClick={() => this.deleteProduct(this.state.productToDelete)}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default ProductGrid;

