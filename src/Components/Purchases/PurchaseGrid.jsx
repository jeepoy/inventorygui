import React, { Component } from 'react';
import { Spinner, Modal, Button,  ButtonToolbar, Row, Col ,Form } from 'react-bootstrap';
import { properties } from './../properties';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import * as moment from 'moment';

class PurchaseGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchases: [],
            products: [],
            suppliers: [],
            date: "",
            product: "",
            supplier: "",
            errorMessage: "",
            infoMessage: "",
            loading: true,            
            showDeleteModal: false,
            purchaseToDelete: "",
            rootUrl: properties.rootUrl,
            filtered: [ 
                        {id: "date", value: ""}
                       ,{id: "product", value: "Choose Product"}
                       ,{id: "supplier", value: "Choose Supplier"}
                      ],
        };
        this.loadGridData();  
        
    }

    loadGridData = () => {
        var date, product, supplier;
        date = (this.state.date.trim().length === 0 || this.state.date === 'Invalid date') ? '%20' : this.state.date;
        product = this.state.product.trim().length === 0 ? '%20' : this.state.product;
        supplier = this.state.supplier.trim().length === 0 ? '%20' : this.state.supplier;

        this.setState({errorMessage: "", loading: true});

        fetch(this.state.rootUrl + '/purchase/list/'+date+'/'+supplier+'/'+product)        
        .then(response => response.json())
        .then(data => this.setState({purchases: data,errorMessage: "", loading: false, infoMessage: this.loadMessage()}))
        .catch(error => this.setState({errorMessage : error.message, loading: false, infoMessage: ""}))
        
        this.populateProductListBox();
        this.populateSupplierListBox();
        console.log("grid loaded.")        
        console.log(this.state.loading);
    }

    populateProductListBox = () => {
        axios.get(this.state.rootUrl + '/product/all/').then(res => {
            const products = res.data;
            this.setState({ products });
        }).catch(function (error) {
            alert(error);
        });
    }

    populateSupplierListBox = () => {
        axios.get(this.state.rootUrl + '/supplier/all/').then(res => {
            const suppliers = res.data;
            this.setState({ suppliers });
        }).catch(function (error) {
            alert(error);
        });
    }

    loadMessage= () => {
        return  'Successfully refreshed data at ' + moment().format('LTS');       
    }


    handleEdit = (id) => {
        this.props.setTabKey("purchaseEntry");
        this.props.setPurchaseId(id);
        this.props.setAction("edit");
    }

    handleDelete = (purchase) => {
        this.setState({showDeleteModal: true})
        this.setState({purchaseToDelete: purchase})
    }

    deletepurchase = (purchase) => {

        fetch(this.state.rootUrl + '/purchase/delete/'+ purchase.id) 
       .catch(error => this.setState({errorMessage : error.message}))
       
       this.loadGridData();
       this.setState({showDeleteModal: false})
    }

    handleChange = (event) => {

        // url parameters
        var newValue = event.target.name === 'date' ? moment(event.target.value).format('YYYYMMDD') : event.target.value;
        this.setState({ [event.target.name] : newValue });

        // Table parameters
        var eventIndex, filterObj, rowIndex;
        eventIndex = event.nativeEvent.target.selectedIndex;
        filterObj = [...this.state.filtered];
        rowIndex = null;

        for(var i = 0; i < filterObj.length; i++) {
            if(filterObj[i]['id'] === event.target.name) {
                rowIndex = i;
            }
        }

        filterObj[rowIndex]['value'] = event.target.name === 'date' ? event.target.value : event.target[eventIndex].text;
        this.setState({ filtered: filterObj });
        
    }

    render() {
        const purchaseColumns = [
            { Header: 'ID', id: "rowid", accessor: 'id' },
            {
                Header: "Product",
                accessor: "productName",
                id: "product",
                filterMethod: (filter, row) => {
                  if (filter.value === "Choose Product") {
                    return true;
                  }
                 if (filter.value === row[filter.id]) {
                    return row[filter.id];
                 }
                },
            },
            {
                Header: "Supplier",
                accessor: "supplierName",
                id: "supplier",
                filterMethod: (filter, row) => {
                  if (filter.value === "Choose Supplier") {
                    return true;
                  }
                 if (filter.value === row[filter.id]) {
                    return row[filter.id];
                 }
                },
            },
            {
                Header: "Purchase Date",
                accessor: "purchaseDate",
                id: "date",
                filterMethod: (filter, row) => {
                  if (filter.value === "") {
                    return true;
                  }
                 if (filter.value === row[filter.id]) {
                    return row[filter.id];
                 }
                },
            },
            { Header: 'Quantity', id:"quantity", accessor: 'purchaseQuantity' },
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
                        <Form.Control type="date" name="date" title="Purchase Date" onChange={this.handleChange} required />
                    </Col>
                    <Col sm={3} >
                        <Form.Control as="select" name="product" title="Product" onChange={this.handleChange} required >
                            <option value="" defaultValue>Choose Product</option>
                            {
                                this.state.products.map( (product, i) =>
                                    <option value={product.id} key={i} >{product.productName}</option>
                                )
                            }
                        </Form.Control>
                    </Col>
                    <Col sm={3} >
                        <Form.Control as="select" name="supplier" title="Supplier" onChange={this.handleChange} required >
                            <option value="" defaultValue>Choose Supplier</option>
                            {
                                this.state.suppliers.map( (supplier, i) =>
                                    <option value={supplier.id} key={i} >{supplier.supplierName}</option>
                                )
                            }
                        </Form.Control>
                    </Col>
                </Row>

                <br/>
                <ReactTable 
                    data={this.state.purchases} 
                    columns={purchaseColumns} 
                    filtered={this.state.filtered}
                    defaultPageSize={5}
                    className="-striped -highlight" />
                
                <Modal show={this.state.showDeleteModal} onHide={this.handleClose} className="-striped-highlight">
                    <Modal.Header closeButton>
                        <Modal.Title>Delete purchase</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{"You are about to delete purchase with Product Name: " + this.state.purchaseToDelete.productName}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>Cancel</Button>
                        <Button variant="primary" onClick={() => this.deletepurchase(this.state.purchaseToDelete)}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default PurchaseGrid;

