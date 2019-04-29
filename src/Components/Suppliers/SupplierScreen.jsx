import React, { Component } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import SupplierGrid from "./SupplierGrid";
import SupplierForm from './SupplierForm';

class SupplierScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            supplierId: 0,
            action: '',
            tabKey: 'supplierList'            
        };

    }

    setSupplierId = (supplierId) => { 
        this.setState({ supplierId: supplierId});         
    }   

    setTabKey = (keyForTab) => {
        this.setState({ tabKey: keyForTab}); 
    }   

    setAction = (updateAction) => {
        this.setState({ action: updateAction}); 
    }  

    render() {
        return (
            <Container fluid>
                <Tabs activeKey={this.state.tabKey} onSelect={tabKey => this.setState({ tabKey, supplierId: 0, action: "add" })}  id="controlled-tab">
                    <Tab eventKey="supplierList" title="Supplier Listing" onEnter={ () => this.setSupplierId(undefined)}>
                        <br/>
                        <SupplierGrid setTabKey={this.setTabKey} setSupplierId={this.setSupplierId} setAction={this.setAction} />
                    </Tab>
                    <Tab eventKey="supplierForm" title="Supplier Entry" >
                        <br/>
                        <SupplierForm action={this.state.action} supplierId={this.state.supplierId}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default SupplierScreen;
