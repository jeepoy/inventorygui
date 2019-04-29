import React, { Component } from 'react';
import { Spinner, ButtonToolbar, Modal, Button } from 'react-bootstrap';
import { properties } from './../properties';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import * as moment from 'moment';

class SupplierGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suppliers: [],
            errorMessage: "",
            infoMessage: "",
            loading: true,
            showDeleteModal: false,
            supplierToDelete: "",
            rootUrl: properties.rootUrl,
        };
        this.loadGridData();  
    }

    loadGridData = () => {
        
        this.setState({errorMessage: "", loading: true});

        fetch(this.state.rootUrl + '/supplier/all/')        
        .then(response => response.json())
        .then(data => this.setState({suppliers: data,errorMessage: "", loading: false, infoMessage: this.loadMessage()}))
        .catch(error => this.setState({errorMessage : error.message, loading: false, infoMessage: ""}))

        console.log("grid loaded.")

    }

    loadMessage= () => {
        return  'Successfully refreshed data at ' + moment().format('LTS'); 
    }


    handleEdit = (id) => {
        this.props.setTabKey("supplierForm");
        this.props.setSupplierId(id);
        this.props.setAction("edit");

        console.log(id);
    }

    handleDelete = (supplier) => {
        this.setState({showDeleteModal: true})
        this.setState({supplierToDelete: supplier})
    }

    deleteSupplier = (supplier) => {

        fetch(this.state.rootUrl + '/supplier/delete/'+ supplier.id) 
       .catch(error => this.setState({errorMessage : error.message}))
       
       this.loadGridData();
       this.setState({showDeleteModal: false})
    }

    render() {
        const suppliersCol = [
            { Header: 'ID', id: "rowid", accessor: 'id' },
            { Header: 'Name', id: "supplier", accessor: 'supplierName' },
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
                <ReactTable 
                    data={this.state.suppliers} 
                    columns={suppliersCol} 
                    defaultPageSize={5}
                    className="-striped -highlight" />
                
                <Modal show={this.state.showDeleteModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{"You are about to delete Category: " + this.state.supplierToDelete.supplierName}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>Cancel</Button>
                        <Button variant="primary" onClick={() => this.deleteSupplier(this.state.supplierToDelete)}>Delete</Button>
                    </Modal.Footer>
                </Modal>

            </div>
            


                    
        );
    }
}

export default SupplierGrid;

