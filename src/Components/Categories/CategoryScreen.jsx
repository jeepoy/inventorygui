import React, { Component } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import CategoryGrid from "./CategoryGrid";
import CategoryForm from './CategoryForm';

class CategoryScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryId: 0,
            action: '',
            tabKey: 'categoryList'            
        };

    }

    setCategoryId = (catId) => { 
        this.setState({ categoryId: catId});         
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
                <Tabs activeKey={this.state.tabKey} onSelect={tabKey => this.setState({ tabKey, categoryId: 0, action: "add" })}  id="controlled-tab">
                    <Tab eventKey="categoryList" title="Category Listing" onEnter={ () => this.setCategoryId(undefined)}>
                        <br/>
                        <CategoryGrid setTabKey={this.setTabKey} setCategoryId={this.setCategoryId} setAction={this.setAction} />
                    </Tab>
                    <Tab eventKey="categoryForm" title="Category Entry" >
                        <br/>
                        <CategoryForm action={this.state.action} categoryId={this.state.categoryId}/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default CategoryScreen;
