import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { properties } from '../properties';

class SupplierForm extends Component {

    constructor(props) {
        super(props);

        this.state = {       
            supplierId: 0,
            supplierName: '',
            suppliers: [],            
            formErr: [],
            errorMessage: "",
            successMessage: "",
            rootUrl: properties.rootUrl
        };

    }

    getSupplierRecord = (id) => {

        axios.get(this.state.rootUrl + '/supplier/' + id).then(res => {
            const supplier = res.data;
            this.setState({ 
                supplierId : supplier.id,
                supplierName : supplier.supplierName
            });
        }).catch(function (error) {
            alert(error);
        });

    }

    componentDidUpdate(prevProps) {
        if (this.props.supplierId !== prevProps.supplierId) {
            //Means Editting A Record
            if (this.props.supplierId !== undefined && this.props.supplierId > 0) 
                this.getSupplierRecord(this.props.supplierId);            
            else  //Means Adding a record
                this.resetForm();
        }    
        
    }


    handleChange = (event) => {
        this.setState({successMessage: "", errorMessage: ""});
        this.setState({ [event.target.name] : event.target.value });
        const regExpANH = /^[\w\-\s]+$/i; // regular expression for alphanumeric and hypen
        const arrString = ['supplierName']; // for string field
        if(arrString.includes(event.target.name) && !regExpANH.test(event.target.value)) {
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
    

    resetForm = () => {
        this.setState({
            action: 'Add',
            supplierId: 0,
            supplierName: '',
            errorMessage: '',
            successMessage: '',
            formErr: []
        });    
    }

    addSupplier = () => {        
        var url = this.state.rootUrl + '/supplier/add/' + this.state.supplierName;


        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.resetForm();
            this.setState({successMessage : "Successfully Added Supplier.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        })    
    }

    editSupplier = () => {
        var url = this.state.rootUrl + '/supplier/edit/'+this.state.supplierId+'/'+this.state.supplierName;

        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.setState({successMessage : "Successfully Updated Supplier.", errorMessage: ""});
        })
        .catch(error => {
            this.setState({successMessage : "", errorMessage: error.message});            
        }) 
    }


    render() {

        return (
            <div>

                <Container>
                    <Row>
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <h2>{this.props.action === "add" ? "Add Supplier" : "Edit Supplier"}</h2>
                        </Col>
                        <Col xs={3} />
                    </Row>
                    
                    <Row>   
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <Form.Group controlId="fgSupplierName">
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control type="text" name="supplierName" title="Supplier Name" value={this.state.supplierName} onChange={this.handleChange} required />
                            </Form.Group>      
                            <div className="d-flex justify-content-end">                              
                                <Button variant="success" hidden={this.props.action === "add" ? false : true} onClick={() => this.addSupplier()} >Save</Button>
                                <Button variant="primary" hidden={this.props.action === "edit" ? false : true} onClick={() => this.editSupplier()} >Save</Button>        
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

export default SupplierForm;
