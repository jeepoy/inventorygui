import React, { Component } from 'react';
import { Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import { properties } from '../properties';

class ProductForm extends Component {

    constructor(props) {
        super(props);

        this.state = {       
            proId: 0,
            product: [],
            proLblList: [],
            proPartNo: '',
            proName: '',
            proDesc: '',
            categoryId: 0,
            beginning: '',
            minimumRequired: '',
            formErr: [],
            errorMessage: "",
            successMessage: "",
            rootUrl: properties.rootUrl
        };

        this.populateCategoryListBox();

    }

    getProductRecord = (id) => {

        axios.get(this.state.rootUrl + '/product/' + id).then(res => {
            const product = res.data;
            this.setState({ 
                proId : product.id,
                proPartNo : product.partNumber,
                proName : product.productName,
                proDesc : product.productDesc,                
                categoryId : product.categoryId,
                minimumRequired : product.minimumRequired,
                beginning : product.startingInventory
                });
        }).catch(function (error) {
            alert(error);
        });

    }



    handleChange = (event) => {
        this.setState({successMessage: "", errorMessage: ""});

        this.setState({ [event.target.name] : event.target.value });
        const regExpANH = /^[\w\-\s]+$/i; // regular expression for alphanumeric and hypen
        
        const arrString = ['proPartNo','proName']; // for string field
        const arrNumeric = ['categoryId','beginning']; // for numeric field
        if(arrString.includes(event.target.name) && !regExpANH.test(event.target.value)) {
            this.addItemErrArr(event.target.title);
        }else if(arrNumeric.includes(event.target.name) && (parseInt(event.target.value,10) === 0 || event.target.value.trim().length === 0)){
            this.addItemErrArr(event.target.title);   
        }else if(event.target.name === "proDesc" && event.target.value.trim().length === 0){
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
    
    handleDelete = (event) => {
        const delState = window.confirm("Do you really want to delete this product?"); 
        if(delState){
            axios.get( this.state.rootUrl + '/product/delete/'+event.target.id).then(function (response) {
                alert('Product was successfully deleted');
            }).catch(function (error) {
                alert(error);
            });
        }
        event.preventDefault();
        this.componentDidMount();
    }
    

    resetForm = () => {
        this.setState({
            action: 'Add',
            proId: 0,
            proPartNo: '',
            proName: '',
            proDesc: '',
            categoryId: 0,
            beginning: '',
            minimumRequired: '',
            errorMessage: "",
            successMessage: "",
            formErr: []
        });    
    }

    addProduct = () => {        
        var url = this.state.rootUrl + '/product/add/' + this.state.proPartNo+'/'+this.state.proName+'/'+this.state.proDesc+'/'+this.state.categoryId+'/'+this.state.minimumRequired+'/'+this.state.beginning;        


        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.resetForm();
            this.setState({successMessage : "Successfully added Product.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        }) 

        
    }

    editProduct = () => {
        var url = this.state.rootUrl + '/product/edit/'+this.state.proId+'/'+this.state.proPartNo+'/'+this.state.proName+'/'+this.state.proDesc+'/'+this.state.categoryId+'/'+this.state.minimumRequired+'/'+this.state.beginning;

        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.setState({successMessage : "Successfully Updated Product.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        }) 

    }

    populateCategoryListBox = () => {
        axios.get(this.state.rootUrl + '/category/all/').then(res => {
            const proLblList = res.data;
            this.setState({ proLblList });
        }).catch(function (error) {
            alert(error);
        });

    }

    componentDidUpdate(prevProps) {
        if (this.props.productId !== prevProps.productId) {
            this.populateCategoryListBox();
            //Means Editting A Record
            if (this.props.productId !== undefined && this.props.productId > 0) 
                this.getProductRecord(this.props.productId);            
            else  //Means Adding a record
                this.resetForm();
        }    
        
    }


    render() {

        return (
            <div>

                <Container>
                    <Row>
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <h2>{this.props.action === "add" ? "Add Product" : "Edit Product"}</h2>
                        </Col>
                        <Col xs={3} />
                    </Row>
                    
                    <Row>   
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <Form.Group controlId="fgPartNumber">
                                <Form.Label>Part Number</Form.Label>
                                <Form.Control type="text" name="proPartNo" title="Part Number" value={this.state.proPartNo} onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group controlId="fgProductName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" name="proName" title="Product Name" value={this.state.proName} onChange={this.handleChange} required />
                            </Form.Group>                        
                            <Form.Group controlId="fgProductDesc">
                                <Form.Label>Product Description</Form.Label>
                                <Form.Control type="text" name="proDesc" title="Product Description" value={this.state.proDesc} onChange={this.handleChange} required />
                            </Form.Group>
                            <Form.Group controlId="fgProductLabel">
                                <Form.Label>Product Label</Form.Label>
                                <Form.Control as="select" name="categoryId" title="Product Label" value={this.state.categoryId} onChange={this.handleChange} required >
                                    <option value="" defaultValue>Choose...</option>
                                    {
                                        this.state.proLblList.map( (proLabel, i) =>
                                            <option value={proLabel.id} key={i}>{proLabel.categoryName}</option>
                                        )
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="fgMinRequired">
                                <Form.Label>Min Required</Form.Label>
                                <Form.Control type="number" name="minimumRequired" title="Minimum Required" value={this.state.minimumRequired} onChange={this.handleChange} required />
                            </Form.Group>                            
                            <Form.Group controlId="fgStartingInventory">
                                <Form.Label>Starting Inventory</Form.Label>
                                <Form.Control type="number" name="beginning" title="Starting Inventory" value={this.state.beginning} onChange={this.handleChange} required />
                            </Form.Group>
                            <div className="d-flex justify-content-end">
                                <ButtonGroup size="md">                                
                                    <Button variant="success" hidden={this.props.action === "add" ? false : true} onClick={() => this.addProduct()} >Save</Button>
                                    <Button variant="primary" hidden={this.props.action === "edit" ? false : true} onClick={() => this.editProduct()} >Save</Button>
                                </ButtonGroup>            
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

                </Container>         

            </div>
            
        );
    }

}

export default ProductForm
