import React, { Component } from 'react';
import { Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';

class AppBody extends Component {

    constructor(props) {
        super(props);
        this.state = {
            proId: 0,
            products: [],
            proLblList: [],
            proPartNo: '',
            proName: '',
            proDesc: '',
            categoryId: 0,
            beginning: '',
            tabKey: 'proList',
            btnSaveLbl: 'Add',
            formErr: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleResetForm = this.handleResetForm.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name] : event.target.value });
        const regExpANH = /^[-a-zA-Z0-9]+$/; // regular expression for alphanumeric and hypen
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

    addItemErrArr(name){
        if(!this.state.formErr.some(item => name === item)){
            this.setState({ formErr: [...this.state.formErr, name] });
        }
    }

    removeItemErrArr(name){
        var errList = [...this.state.formErr];
        var errListindex = errList.indexOf(name);
        if (errListindex !== -1) {
            errList.splice(errListindex, 1);
            this.setState({ formErr: errList });
        }
    }
    
    handleSubmit(event) {
        var url = 'http://3.92.143.179:5000/product/';
        if(event.target.name === "Add"){
            url = url+'add/'+this.state.proPartNo+'/'+this.state.proName+'/'+this.state.proDesc+'/'+this.state.categoryId+'/'+this.state.beginning;
        }else{
            url = url+'edit/'+this.state.proId+'/'+this.state.proPartNo+'/'+this.state.proName+'/'+this.state.proDesc+'/'+this.state.categoryId+'/'+this.state.beginning;
        }
        axios.post(url).then(function (response) {
            alert('Product transaction was successful!');
        }).catch(function (error) {
            alert(error);
        });
        this.setState({
            proId: 0,
            products: [],
            proLblList: [],
            proPartNo: '',
            proName: '',
            proDesc: '',
            categoryId: 0,
            beginning: 0,
            tabKey: 'proList',
            btnSaveLbl: 'Add',
        });
        event.preventDefault();
        this.componentDidMount();
    }

    handleDelete(event){
        const delState = window.confirm("Do you really want to delete this product?"); 
        if(delState){
            axios.get('http://3.92.143.179:5000/product/delete/'+event.target.id).then(function (response) {
                alert('Product was successfully deleted');
            }).catch(function (error) {
                alert(error);
            });
        }
        event.preventDefault();
        this.componentDidMount();
    }
    
    handleEdit(event){
        var proArrIndex = this.state.products.findIndex(obj => parseInt(obj.id,10) === parseInt(event.target.id,10));
        var rowData = this.state.products[proArrIndex];    
        this.setState({ 
            proId: rowData.id,
            proPartNo: rowData.partNumber,
            proName: rowData.productName,
            proDesc: rowData.productDesc,
            categoryId: rowData.categoryId,
            beginning: rowData.startingInventory,
            btnSaveLbl: 'Update',
            tabKey: 'proEntry'
        });
        event.preventDefault();
    }

    handleResetForm(event){
        this.setState({
            proId: 0,
            proPartNo: '',
            proName: '',
            proDesc: '',
            categoryId: 0,
            beginning: 0,
            btnSaveLbl: 'Add',
            formErr: []
        });
        event.preventDefault();
    }

    componentDidMount() {
        axios.get('http://3.92.143.179:5000/product/all/').then(res => {
            const products = res.data;
            this.setState({ products });
        }).catch(function (error) {
            alert(error);
        });
        axios.get('http://3.92.143.179:5000/category/all/').then(res => {
            const proLblList = res.data;
            this.setState({ proLblList });
        }).catch(function (error) {
            alert(error);
        });
    }

    render() {
        let btnSaveState = this.state.formErr.length > 0 ? true : false;
        return (
            <Container fluid>
                <Tabs activeKey={this.state.tabKey} onSelect={tabKey => this.setState({ tabKey })} id="controlled-tab">
                    <Tab eventKey="proList" title="Product Listing">
                        <br/>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Name</th>
                                    <th>Desc</th>
                                    <th>Part #</th>
                                    <th>Label</th>
                                    <th>Beginning</th>
                                    <th>Received</th>
                                    <th>Sold</th>
                                    <th>OnHand</th>
                                    <th>Required</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { 
                                    this.state.products.map( (product, i) =>
                                        <tr key={i}>
                                            <td>{product.id}</td>
                                            <td>{product.productName}</td>
                                            <td>{product.productDesc}</td>
                                            <td>{product.partNumber}</td>
                                            <td>{product.productLabel}</td>
                                            <td>{product.startingInventory}</td>
                                            <td>{product.inventoryReceived}</td>
                                            <td>{product.inventorySold}</td>
                                            <td>{product.inventoryOnHand}</td>
                                            <td>{product.minimumRequired}</td>
                                            <td>
                                                <Button variant="primary" size="sm" onClick={this.handleEdit} ><i id={product.id} className="fas fa-pen"></i></Button> 
                                                <Button variant="danger" size="sm" onClick={this.handleDelete} ><i id={product.id} className="far fa-trash-alt"></i></Button>
                                            </td>
                                        </tr>
                                    ) 
                                }
                            </tbody>
                        </Table>
                    </Tab>
                    <Tab eventKey="proEntry" title="Product Entry">
                        <br/>
                        <Row>
                            <Col xs={3}>
                                <Form className="d-flex flex-column" name={this.state.btnSaveLbl} onSubmit={this.handleSubmit}>
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
                                    <Form.Group controlId="fgStartingInventory">
                                        <Form.Label>Starting Inventory</Form.Label>
                                        <Form.Control type="number" name="beginning" title="Starting Inventory" value={this.state.beginning} onChange={this.handleChange} required />
                                    </Form.Group>
                                    <ButtonGroup size="sm">
                                        <Button variant="success" onClick={this.handleResetForm} >New</Button>
                                        <Button type="submit" variant="primary" disabled={btnSaveState} >{this.state.btnSaveLbl}</Button>
                                    </ButtonGroup>
                                </Form>
                            </Col>
                            <Col xs={3}>
                                <Alert variant="danger" show={btnSaveState}>
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
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default AppBody;
