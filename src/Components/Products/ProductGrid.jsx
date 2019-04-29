import React, { Component } from 'react';
import { Spinner, Modal, Button,  ButtonToolbar, Row, Col ,Form } from 'react-bootstrap';
import { properties } from './../properties';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import * as moment from 'moment';


class ProductGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            category: [],
            errorMessage: "",
            infoMessage: "",
            loading: true,            
            showDeleteModal: false,
            productToDelete: "",
            rootUrl: properties.rootUrl,
            filtered: [],
        };
        this.loadGridData();  
    }

    loadGridData = () => {

        this.setState({errorMessage: "", loading: true});

        fetch(this.state.rootUrl + '/product/all/')        
        .then(response => response.json())
        .then(data => this.setState({products: data,errorMessage: "", loading: false, infoMessage: this.loadMessage()}))
        .catch(error => this.setState({errorMessage : error.message, loading: false, infoMessage: ""}))

        this.populateCategoryListBox();
        console.log("grid loaded.")        
        console.log(this.state.loading);

    }

    populateCategoryListBox = () => {
        axios.get(this.state.rootUrl + '/category/all/').then(res => {
            const category = res.data;
            this.setState({ category });
        }).catch(function (error) {
            alert(error);
        });
    }

    loadMessage= () => {
        /*var date = new Date();
        var hours = date.getHours();
        var days = date.getDay(); 
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        seconds = seconds < 10 ? '0'+seconds : seconds;*/

        return  'Successfully refreshed data at ' + moment().format('LTS'); 
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

    categoryFilter = (cat) => {
        this.setState({ filtered: [{ id: 'cat', value: cat }] })
    }

    render() {
        const proColumns = [
            { Header: 'ID', id: "rowid", accessor: 'id' },
            { Header: 'Name', id: "proname", accessor: 'productName' },
            { Header: 'Part #', id:"prono", accessor: 'productNumber' },
            {
                Header: "Category",
                accessor: "productLabel",
                id: "cat",
                filterMethod: (filter, row) => {
                  if (filter.value === "all") {
                    return true;
                  }
                 if (filter.value === row[filter.id]) {
                    return row[filter.id];
                 }
                },
            },
            { Header: 'Min Required', id:"minInvtr", accessor: 'minInventory' },
            { Header: 'Starting', id:"startInvtr", accessor: 'startingInventory' },
            { Header: 'Purchased', id:"invtrRcvd", accessor: 'inventoryReceived' },
            { Header: 'Sold', id:"invtrSold", accessor: 'inventorySold' },
            { Header: 'OnHand', id:"invtrOnH", accessor: 'inventoryOnHand' },
            { Header: 'Action', id: 'action',
                accessor: d => (
                    <div>
                        <Button variant="primary" size="sm" onClick={() => this.handleEdit(d.id)} ><i id={d.id} className="fas fa-pen"></i></Button> 
                        <Button variant="danger" size="sm" onClick={() => this.handleDelete(d)} ><i id={d.id} className="far fa-trash-alt"></i></Button> 
                    </div>
                )
            }
        ];

        return (
            <div>                
                <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">                    
                    <Spinner animation="border" hidden={!this.state.loading} />
                    <h6 style={{color:"red"}} hidden={!this.state.errorMessage}>{this.state.errorMessage}</h6>                    
                    <h6 style={{color:"green"}}>{this.state.infoMessage}</h6>                    
                    <Button size="sm" variant="success"  onClick={() => this.loadGridData()} >Refresh</Button>       
                </ButtonToolbar>
                <br/>
                
                <Row className="justify-content-end">
                    <Col sm={2} >
                        <Form.Control as="select" title="Category"
                        onChange={event => this.categoryFilter(event.target.value)}
                        style={{ width: "100%" }}
                        >
                            <option value="all">Choose Category</option>
                            {
                                this.state.category.map( (cat, i) =>
                                    <option key={i} value={cat.categoryName}>{cat.categoryName}</option>
                                ) 
                            }
                        </Form.Control>
                    </Col>
                </Row>
                
                <br/>
                <ReactTable 
                    data={this.state.products} 
                    columns={proColumns} 
                    filtered={this.state.filtered}
                    defaultPageSize={5}
                    className="-striped -highlight" />
                
                <Modal show={this.state.showDeleteModal} onHide={this.handleClose} className="-striped-highlight">
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{"You are about to delete Product with Part Number: " + this.state.productToDelete.productNumber}</Modal.Body>
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

