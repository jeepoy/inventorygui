import React, { Component } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import PurchaseGrid from "./PurchaseGrid";
import PurchaseForm from './PurchaseForm';

class PurchaseScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            purchaseId: 0,
            action: '',
            tabKey: 'purchaseList'            
        };

    }

    setPurchaseId = (pcdId) => { 
        this.setState({ purchaseId: pcdId});         
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
                <Tabs activeKey={this.state.tabKey} onSelect={tabKey => this.setState({ tabKey, purchaseId: 0, action: "add" })}  id="controlled-tab">
                    <Tab eventKey="purchaseList" title="Purchase Listing" onEnter={ () => this.setPurchaseId(undefined)}>
                        <br/>
                        <PurchaseGrid setTabKey={this.setTabKey} setPurchaseId={this.setPurchaseId} setAction={this.setAction} />
                    </Tab>
                    <Tab eventKey="purchaseEntry" title="Purchase Entry" >
                        <br/>
                        <PurchaseForm action={this.state.action} purchaseId={this.state.purchaseId}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default PurchaseScreen;
