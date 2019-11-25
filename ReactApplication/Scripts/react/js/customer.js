import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Modal, Form, Header, Button, FormItem, Divider, Icon, Font } from "semantic-ui-react";
import { faTrash, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import CreateCustomerModal from '../createcustomer.js';


export default class Cust extends React.Component {

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

    openModalHandler = () => {
        this.setState({
            isShowing: true,
            customerName: '',
            customerAddress: ''
        });

    }

    openDeleteModal(id) {
        this.setState({
            show: true,
            activeCustomerId: id
        });

    }

    closeDeleteModal = () => {
        this.setState({
            show: false
        });
    }

    openEditModal(id) {
        this.getCustomerById(id);
        this.setState({
            showEdit: true,
        });
    }

    closeEditModal = () => {
        this.setState({
            showEdit: false
        });
    }

    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });       
    }

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if ((this.state.listOfCustomers !== prevState.listOfCustomers) && prevState.listOfCustomers.length > 0) {
            
            this.getAllCustomerData()

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            isShowing: false
        });
        this.setState({
            showEdit: false
        });
        const custData = {
            id: this.state.activeCustomerId,
            name: this.state.customerName,
            address: this.state.customerAddress,
        }
        console.log(custData)

        axios({
            method: 'post',
            url: '/Customer/Create',
            data: custData
        })
            .then(res => {
                this.setState({
                    activeCustomerId: 0,
                    customerName: '',
                    customerAddress: ''
                })
                console.log(this.state.activeCustomerId);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.getAllCustomerData();
    }

    getAllCustomerData = () => {

        axios({
            method: 'get',
            url: '/Customer/getAllCustomer',
        })
            .then(res => {
                this.setState({ listOfCustomers: res.data });

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    getCustomerById(id) {

        axios({
            method: 'get',
            url: '/Customer/Edit/' + id,
        })
            .then(res => {
                this.setState({
                    activeCustomerId: id,
                    customerName: res.data.Name,
                    customerAddress: res.data.Address
                });
                console.log("get" + res.data.Address);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteCustomer = () => {
        this.setState({
            show: false
        });
        const id = this.state.activeCustomerId;
        axios({
            method: 'post',
            url: '/Customer/Delete/' + id
        })
            .then(res => {
                this.setState(previousState => {
                    return {
                        listOfCustomers: previousState.listOfCustomers.filter(m => m.Id !== id)
                    };
                });
            }
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    createCustomerTableData = () => {

        let custmerList = []
        custmerList = this.state.listOfCustomers;

        if (custmerList.length > 0) {
            return (
                custmerList.map(custmer =>
                    <tr key={custmer.Id}>
                        <td className="two wide" style={{ height: '20%' }}>{custmer.Name}</td>
                        <td className="two wide" >{custmer.Address}</td>
                        <td className="two wide" >
                            <Button color="orange" content="Edit" onClick={() => this.openEditModal(custmer.Id)} >
                                <FontAwesomeIcon icon={faEdit} />Edit
                            </Button>
                            <Button color="red" content="Delete" onClick={() => this.openDeleteModal(custmer.Id)} >
                                <FontAwesomeIcon icon={faTrash} />Delete
                         </Button>
                        </td>
                    </tr>
                )

            )
        } else {
            this.getAllCustomerData();
            if (this.state.listOfCustomers.length > 0) {
                return (
                    this.state.listOfCustomers.map(custmer =>
                        <tr key={custmer.Id}>
                            <td className="two wide" >{custmer.Name}</td>
                            <td className="ten wide">{custmer.Address}</td>
                            <td className="four wide" >
                                <Button color="orange" content="Edit" onClick={() => this.openEditModal(custmer.Id)} />
                                <Button color="red" content="Delete" onClick={() => this.openDeleteModal(custmer.Id)} />
                            </td>
                        </tr>
                    )

                )
            }
        }
    }


    render() {

        return (
            <div>
                <button class="ui blue button" id="bt" onClick={this.openModalHandler}>
                    <FontAwesomeIcon icon={faPlusSquare} />NewCusomer
                </button>

                <React.Fragment>
                    <table className="ui striped table" style={{ width: '50%' }}>
                        <thead>
                            <tr>
                                <th className="two wide">Name</th>
                                <th className="two wide">Address</th>
                                <th className="two wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createCustomerTableData()}
                        </tbody>
                    </table>
                </React.Fragment>

                <Modal size='tiny' open={this.state.isShowing}>
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
               

                <Modal size='tiny' open={this.state.show}>
                    <Modal.Header>Delete Customer</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" content="Close" onClick={this.closeDeleteModal} />
                        <Button color="red" labelPosition='right' icon={<Icon name='trash' />} content='delete' onClick={this.deleteCustomer} />
                    </Modal.Actions>
                </Modal>

                <Modal size='tiny' open={this.state.showEdit} >
                    <Header content="Edit Customer" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input value={this.state.activeCustomerId} type="hidden" name="activeCustomerId" />
                            <Form.Input label="Name" value={this.state.customerName} type="text" required name="customerName" onChange={this.handleChange} />
                            <Form.Input label="Address" value={this.state.customerAddress} type="text" required name="customerAddress" onChange={this.handleChange} />

                            <Button color="black" content="Close" onClick={this.closeEditModal} />
                            <Button color="teal" type="primary" htmlType="submit">Edit</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

            </div>
        )
    }


}