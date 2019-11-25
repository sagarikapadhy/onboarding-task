import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Modal, Form, Header, Button, FormItem, Divider, Icon, Font } from "semantic-ui-react";
import { faTrash, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';


export default class CreateCustomerModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowing: false,
            show: false,
            showEdit: false,
            customerName: '',
            customerAddress: '',
            listOfCustomers: [],
            activeCustomerId: 0,
        }

    }


    render() {
        if (!this.props.open) {
            return null;
        }
        return (
            <Modal size='tiny'  >
                <Header content="Create Customer" as="h3" />
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input label="Name" value={this.state.customerName} required type="text" name="customerName" placeholder="name" onChange={this.handleChange} />
                        <Form.Input label="Address" value={this.state.customerAddress} required type="text" name="customerAddress" placeholder="Address" onChange={this.handleChange} />

                        <Button color="black" content="Close" onClick={this.closeModalHandler}></Button>
                        <Button color="teal" type="primary" htmlType="submit">Create</Button>

                    </Form>
                </Modal.Content>

            </Modal>
            
            
            )
       
    }

}