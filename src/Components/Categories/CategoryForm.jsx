import React, { Component } from 'react';
import { Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import axios from 'axios';
import { properties } from '../properties';

class CategoryForm extends Component {

    constructor(props) {
        super(props);

        this.state = {       
            categoryId: 0,
            categoryName: '',
            categories: [],            
            formErr: [],
            errorMessage: "",
            successMessage: "",
            rootUrl: properties.rootUrl
        };

    }

    getCategoryRecord = (id) => {

        axios.get(this.state.rootUrl + '/category/' + id).then(res => {
            const category = res.data;
            this.setState({ 
                categoryId : category.id,
                categoryName : category.categoryName
                });
        }).catch(function (error) {
            alert(error);
        });

    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryId !== prevProps.categoryId) {
            //Means Editting A Record
            if (this.props.categoryId !== undefined && this.props.categoryId > 0) 
                this.getCategoryRecord(this.props.categoryId);            
            else  //Means Adding a record
                this.resetForm();
        }    
        
    }


    handleChange = (event) => {
        this.setState({successMessage: "", errorMessage: ""});
        this.setState({ [event.target.name] : event.target.value });
        const regExpANH = /^[\w\-\s]+$/i; // regular expression for alphanumeric and hypen
        const arrString = ['categoryName']; // for string field
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
            categoryId: 0,
            categoryName: '',
            errorMessage: '',
            successMessage: '',
            formErr: []
        });    
    }

    addCategory = () => {        
        var url = this.state.rootUrl + '/category/add/' + this.state.categoryName;


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

    editCategory = () => {
        var url = this.state.rootUrl + '/category/edit/'+this.state.categoryId+'/'+this.state.categoryName;

        fetch(url, {method: "POST"})
        .then(response => response.json())
        .then(data => {
            this.setState({successMessage : "Successfully Updated Category.", errorMessage: ""});
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
                            <h2>{this.props.action === "add" ? "Add Category" : "Edit Category"}</h2>
                        </Col>
                        <Col xs={3} />
                    </Row>
                    
                    <Row>   
                        <Col xs={1}/>
                        <Col xs={8}> 
                            <Form.Group controlId="fgCategoryName">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control type="text" name="categoryName" title="Category Name" value={this.state.categoryName} onChange={this.handleChange} required />
                            </Form.Group>      
                            <div className="d-flex justify-content-end">
                                <ButtonGroup size="md">                                
                                    <Button variant="success" hidden={this.props.action === "add" ? false : true} onClick={() => this.addCategory()} >Save</Button>
                                    <Button variant="primary" hidden={this.props.action === "edit" ? false : true} onClick={() => this.editCategory()} >Save</Button>
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

export default CategoryForm
