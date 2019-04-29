import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { properties } from '../properties';
import * as moment from 'moment';

class PurchaseForm extends Component {

    constructor(props) {
        super(props);

        this.state = {       
            purchaseId: 0,
            purchaseDate: moment(new Date()).format('YYYY-MM-DD'),
            product: 0,
            supplier: 0,
            quantity: "",
            productList: [],
            supplierList: [],
            formErr: [],
            errorMessage: "",
            successMessage: "",
            rootUrl: properties.rootUrl
        };

        this.populateProductListBox();
        this.populateSupplierListBox();

    }

    getPurchaseRecord = (id) => {

        axios.get(this.state.rootUrl + '/purchase/' + id).then(res => {
            const purchase = res.data;
            this.setState({ 
                purchaseId : purchase.id,
                product : purchase.productId,
                supplier : purchase.supplierId,
                purchaseDate: purchase.purchaseDate,
                quantity : purchase.purchaseQuantity,                
            });
        }).catch(function (error) {
            alert(error);
        });

    }

    populateProductListBox = () => {
        axios.get(this.state.rootUrl + '/product/all/').then(res => {
            const productList = res.data;
            this.setState({ productList });
        }).catch(function (error) {
            alert(error);
        });
    }

    populateSupplierListBox = () => {
        axios.get(this.state.rootUrl + '/supplier/all/').then(res => {
            const supplierList = res.data;
            this.setState({ supplierList });
        }).catch(function (error) {
            alert(error);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.purchaseId !== prevProps.purchaseId) {
            this.populateProductListBox();
            this.populateSupplierListBox();
            //Means Editting A Record
            if (this.props.purchaseId !== undefined && this.props.purchaseId > 0) 
                this.getPurchaseRecord(this.props.purchaseId);            
            else  //Means Adding a record
                this.resetForm();
        }       
    }

    handleChange = (event) => {
        this.setState({successMessage: "", errorMessage: ""});

        this.setState({ [event.target.name] : event.target.value });

        const arrNumeric = ['product', 'supplier', 'quantity']; // for numeric field
        if(arrNumeric.includes(event.target.name) && (parseInt(event.target.value,10) === 0 || event.target.value.trim().length === 0)){
            this.addItemErrArr(event.target.title);   
        }else if(event.target.name === "purchaseDate" && event.target.value.trim().length === 0){
            this.addItemErrArr(event.target.title);
        }else{
            this.removeItemErrArr(event.target.title);    
        }
    }

    addItemErrArr = (name) => {
        if(!this.state.formErr.some(item => name === item)){
            this.setState({ formErr: [...this.state.formErr, name] });
        }
    }

    removeItemErrArr = (name) => {
        var errList = [...this.state.formErr];
        var errListindex = errList.indexOf(name);
        if (errListindex !== -1) {
            errList.splice(errListindex, 1);
            this.setState({ formErr: errList });
        }
    }

    addPurchase = () => {        
        var url = this.state.rootUrl + '/purchase/add/'+moment(this.state.purchaseDate).format('YYYYMMDD')+'/'+this.state.product+'/'+this.state.supplier+'/'+this.state.quantity;

        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.resetForm();
            this.setState({successMessage : "Successfully Added Purchase.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        })
    }

    editPurchase = () => {
        var url = this.state.rootUrl + '/purchase/edit/'+this.state.purchaseId+'/'+moment(this.state.purchaseDate).format('YYYYMMDD')+'/'+this.state.supplier+'/'+this.state.quantity;
        
        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.setState({successMessage : "Successfully Updated Purchase.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        })
    }

    resetForm = () => {
        this.setState({
            action: 'Add',
            purchaseId: 0,
            purchaseDate: moment(new Date()).format('YYYY-MM-DD'),
            product: 0,
            supplier: 0,
            quantity: "",
            formErr: [],
            errorMessage: "",
            successMessage: "",
        });    
    }

    render() {

        return (
            <div>

                <Container>
                    <Row>
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <h2>{this.props.action === "add" ? "Add Purchase" : "Edit Purchase"}</h2>
                        </Col>
                        <Col xs={3} />
                    </Row>

                    <Row>   
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <Form.Group controlId="fgPurchaseDate">
                                <Form.Label>Purchase Date</Form.Label>
                                <Form.Control type="date" name="purchaseDate" title="Purchase Date" value={this.state.purchaseDate} onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group controlId="fgProduct">
                                <Form.Label>Product</Form.Label>
                                <Form.Control as="select" name="product" title="Product" disabled={this.props.action === "add" ? false : true} value={this.state.product} onChange={this.handleChange} required >
                                    <option value="" defaultValue>Choose...</option>
                                    {
                                        this.state.productList.map( (product, i) =>
                                            <option value={product.id} key={i}>{product.productName}</option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="fgSupplier">
                                <Form.Label>Supplier</Form.Label>
                                <Form.Control as="select" name="supplier" title="Supplier" value={this.state.supplier} onChange={this.handleChange} required >
                                    <option value="" defaultValue>Choose...</option>
                                    {
                                        this.state.supplierList.map( (supplier, i) =>
                                            <option value={supplier.id} key={i}>{supplier.supplierName}</option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="fgQuantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="number" name="quantity" title="Quantity" value={this.state.quantity} onChange={this.handleChange} required />
                            </Form.Group>
                            <div className="d-flex justify-content-end">                             
                                <Button variant="success" hidden={this.props.action === "add" ? false : true} onClick={() => this.addPurchase()} >Save</Button>
                                <Button variant="primary" hidden={this.props.action === "edit" ? false : true} onClick={() => this.editPurchase()} >Save</Button>        
                            </div>
                        </Col>
                        <Col xs={3}>
                            <Alert variant="danger" hidden={this.state.errorMessage === "" ? true : false} >{this.state.errorMessage}</Alert>
                            <Alert variant="success" hidden={this.state.successMessage === "" ? true : false} >{this.state.successMessage}</Alert>
                            <Alert variant="danger" show={this.state.formErr.length > 0 ? true : false}>
                                <label>Invalid Fields:</label>
                                {
                                    this.state.formErr.map( (errField, i) =>
                                        <ul key={i}>
                                            <li>{errField}</li>
                                        </ul>
                                    )
                                }
                            </Alert>
                        </Col>
                    </Row>
                    
                    <br/>
                </Container>         

            </div>
            
        );
    }

}

export default PurchaseForm;
