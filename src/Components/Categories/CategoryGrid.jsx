import React, { Component } from 'react';
import { Spinner, ButtonToolbar, Modal, Container, Row, Col, Table, Form, ButtonGroup, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { properties } from './../properties';


class CategoryGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            errorMessage: "",
            infoMessage: "",
            loading: true,
            showDeleteModal: false,
            categoryToDelete: "",
            rootUrl: properties.rootUrl
        };
        this.loadGridData();  
    }

    loadGridData = () => {
        
        this.setState({errorMessage: "", loading: true});

        fetch(this.state.rootUrl + '/category/all/')        
        .then(response => response.json())
        .then(data => this.setState({categories: data,errorMessage: "", loading: false, infoMessage: this.loadMessage()}))
        .catch(error => this.setState({errorMessage : error.message, loading: false, infoMessage: ""}))


        console.log("grid loaded.")

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
        this.props.setTabKey("categoryForm");
        this.props.setCategoryId(id);
        this.props.setAction("edit");

        console.log(id);
    }

    handleDelete = (category) => {
        this.setState({showDeleteModal: true})
        this.setState({categoryToDelete: category})
    }

    deleteCategory = (category) => {

        fetch(this.state.rootUrl + '/category/delete/'+ category.id) 
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
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            this.state.categories.map( (category, i) =>
                                <tr key={i}>
                                    <td>{category.id}</td>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        <Button variant="primary" size="sm" onClick={() => this.handleEdit(category.id)} ><i id={category.id} className="fas fa-pen"></i></Button> 
                                        <Button variant="danger" size="sm" onClick={() => this.handleDelete(category)} ><i id={category.id} className="far fa-trash-alt"></i></Button>
                                    </td>
                                </tr>
                            ) 
                        }
                    </tbody>
                </Table>
                
                <Modal show={this.state.showDeleteModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{"You are about to delete Category: " + this.state.categoryToDelete.partNumber}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>Cancel</Button>
                        <Button variant="primary" onClick={() => this.deleteCategory(this.state.categoryToDelete)}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </div>
            


                    
        );
    }
}

export default CategoryGrid;

