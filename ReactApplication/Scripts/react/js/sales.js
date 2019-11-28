import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Modal, Form, Header, Button, Icon, Font } from "semantic-ui-react";
import { faTrash,faTimes,faEdit,faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateTimePicker from 'react-datetime-picker';
import {DateInput,DateTimeInput} from 'semantic-ui-calendar-react';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';


export default class Sale extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCreate: false,
            showDelete: false,
            showEdit: false,
            saleDate: '',
            customerId: 0,
            productId: 0,
            storeId: 0,
            customerName: '',
            productName: '',
            storeName: '',
            date: new Date(),
            listOfCustomers: [],
            listOfProducts: [],
            listOfStores: [],
            listOfSales: [],
            activeSaleId: 0,
            
        }

    }

    openCreateModal = () => {
        this.getAllCustomerData();
        this.getAllProductDetails();
        this.getAllStoreData();
   
        this.setState({
            showCreate: true,
        });
    }

    closeCreateModal = () => { 
        
        this.setState({
            showCreate: false,
        });
    }

    handleChange = (event, data) => {
        debugger
        const name = data.name;
        const value = data.value;
        this.setState({
            [name]: value,
        });
    }

    openEditModal(Id) {
        if (this.state.listOfCustomers.length == 0) {
            this.getAllCustomerData();
            this.getAllProductDetails();
            this.getAllStoreData();
        }
        this.getSaleDataById(Id);        
        this.setState({
            showEdit: true,
        });
    }

    closeEditModal = () => {
        
        this.setState({
            showEdit: false
        });
    }

    openDeleteModal(id) {
        this.setState({
            showDelete: true,
            activeSaleId: id
        });

    }

    closeDeleteModal = () => {
    this.setState({
        showDelete: false
        
    });
    }

    deleteProduct = () => {
        this.setState({
            showDelete: false,
        })
    }

    onChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }

    componentDidUpdate() {
        this.getAllSalesData();
    }

    getAllCustomerData = () => {

        axios({
            method: 'get',
            url: '/Customer/getAllCustomer',
        })
            .then(res => {
                this.setState({
                    listOfCustomers: res.data

                });
                console.log("nwww" + this.state.listOfCustomers)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    getAllStoreData = () => {
        axios({
            method: 'get',
            url: '/Stores/getAllStores',
        })
            .then(res => {
                this.setState({ listOfStores: res.data });
                console.log(res.data)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    getAllProductDetails = () => {

        axios({
            method: 'get',
            url: '/Product/getAllProducts',
        })
            .then(res => {
                this.setState({ listOfProducts: res.data });

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    getSaleDataById = (Id) => {

        axios({
            method: 'get',
            url: '/Sales/Details/'+Id,
        })
            .then(res => {
                this.setState({
                    activeSaleId: res.data.Id,
                    customerId: res.data.CustomerId,
                    productId: res.data.ProductId,
                    storeId: res.data.StoreId,
                    customerName: res.data.CustomerName,
                    productName: res.data.ProductName,
                    storeName: res.data.StoreName,
                    date: res.data.DateSold
                });
                console.log(res.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSubmit = () => {
        debugger
        this.setState({ showCreate: false });
        this.setState({
            showEdit: false
        });
        const saleData = {
            id: this.state.activeSaleId,
            productId: this.state.productId,
            customerId: this.state.customerId,
            storeId: this.state.storeId,
            dateSold: this.state.date
        }

        axios({
            method: 'post',
            url: '/Sales/Create',
            data: saleData
        })
            .then(function (res) {
                console.log(res);

            })
            .catch(function (error) {
                console.log(error);
            });
        this.getAllSalesData();
    }

    getAllSalesData = () => {
        axios({
            method: 'get',
            url: '/Sales/getAllSales',
        })
            .then(res => {               
                this.setState({ listOfSales: res.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteSale = () => {
        this.setState({
            showDelete: false
        });
        const id = this.state.activeSaleId;
        console.log("iiiiddd"+id)
        axios({
            method: 'post',
            url: '/Sales/Delete/'+id
        })
            .then(res => {
                this.setState(previousState => {
                    return {
            //            listOfProducts: previousState.listOfProducts.filter(p => p.Id !== id)
                    };
                });
            }
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    createSalesTableData = () => {

        let salesList = []
        salesList = this.state.listOfSales;

        if (salesList.length > 0) {
            return (
                salesList.map(sale =>
                    <tr key={sale.Id}>
                        <td className="two wide" style={{ height: '20%' }}>{sale.CustomerName}</td>
                        <td className="two wide" >{sale.ProductName}</td>
                        <td className="two wide" >{sale.StoreName}</td>
                        <td className="two wide" >{sale.DateSold}</td>
                        <td className="two wide" >
                            <Button color="orange" onClick={() => this.openEditModal(sale.Id)} >
                                <FontAwesomeIcon icon={faEdit} />Edit
                         </Button>
                            <Button color="red" content="Delete" onClick={() => this.openDeleteModal(sale.Id)}>
                                <FontAwesomeIcon icon={faTrash} />Delete
                         </Button>
                        </td>
                    </tr>
                )

            )
        } else {
            this.getAllSalesData();
            if (this.state.listOfSales.length > 0) {
                return (
                    this.state.listOfSales.map(sale =>
                        <tr key={sale.Id}>
                            <td className="two wide" style={{ height: '20%' }}>{sale.CustomerName}</td>
                            <td className="two wide" >{sale.ProductName}</td>
                            <td className="two wide" >{sale.StoreName}</td>
                            <td className="two wide" >{sale.StoreName}</td>
                            <td className="two wide" >{sale.DateSold}</td>
                            <td className="two wide" >
                                <Button color="orange" content="Edit" onClick={() => this.openEditModal(sale.Id)}/>
                                <Button color="red" content="Delete" onClick={() => this.openDeleteModal(sale.Id)}/>
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
                <button class="ui blue button" onClick={this.openCreateModal}>
                    <FontAwesomeIcon icon={faPlusSquare} />Newsale
                </button>

                <React.Fragment>
                    <table className="ui striped table" style={{ width: '85%' }}>
                        <thead>
                            <tr>
                                <th className="two wide">Customer</th>
                                <th className="two wide">Product</th>
                                <th className="two wide">Store</th>
                                <th className="two wide">Date</th>
                                <th className="two wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createSalesTableData()}
                        </tbody>
                    </table>
                </React.Fragment>

                <Modal size='tiny' open={this.state.showCreate} >
                    <Header content="Create Customer" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            
                            <DateInput name="date" placeholder="Date Time" value={this.state.date}  onChange={this.onChange} />
                            <Form.Select fluid label='Customer' name="customerId" required  onChange={this.handleChange} options={this.state.listOfCustomers.map(cs => {
                                return {
                                    key: cs.Id,
                                    text: cs.Name,
                                    value: cs.Id
                                }
                            })} />
                            <Form.Select fluid label='Products' name="productId" required onChange={this.handleChange} options={this.state.listOfProducts.map(pd => {
                                return {
                                    key: pd.Id,
                                    text: pd.Name,
                                    value: pd.Id
                                }
                            })} />
                            <Form.Select fluid label='Stores' name="storeId" required onChange={this.handleChange} options={this.state.listOfStores.map(s => {
                                return {
                                    key: s.Id,
                                    text: s.Name,
                                    value: s.Id
                                }
                            })} />

                            <Button color="black" content="Close" onClick={this.closeCreateModal}></Button>
                            <Button color="teal" type="primary" htmlType="submit">Create</Button>

                        </Form>
                    </Modal.Content>

                </Modal>


                <Modal size='tiny' open={this.state.showEdit} >
                    <Header content="Edit Sale" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input value={this.state.activeSaleId} type="hidden" name="activeProductId" />
                            <DateInput name="date" placeholder="Date Time" value={this.state.date} onChange={this.onChange} />
                            <Form.Select fluid label='Customer' name="customerId" required placeholder={this.state.customerName} onChange={this.handleChange} options={this.state.listOfCustomers.map(cs => {
                                return {
                                    key: cs.Id,
                                    text: cs.Name,
                                    value: cs.Id
                                }
                            })} />
                            <Form.Select fluid label='Products' name="productId" required placeholder={this.state.productName} onChange={this.handleChange} options={this.state.listOfProducts.map(pd => {
                                return {
                                    key: pd.Id,
                                    text: pd.Name,
                                    value: pd.Id
                                }
                            })} />
                            <Form.Select fluid label='Stores' name="storeId" required placeholder={this.state.storeName} onChange={this.handleChange} options={this.state.listOfStores.map(s => {
                                return {
                                    key: s.Id,
                                    text: s.Name,
                                    value: s.Id
                                }
                            })} />

                            <Button color="black" content="Close" onClick={this.closeEditModal}></Button>
                            <Button color="teal" type="primary" htmlType="submit">Edit</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

                <Modal size='tiny' open={this.state.showDelete}>
                    <Modal.Header>Delete Sale</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black"  onClick={this.closeDeleteModal} >
                            Close
                        </Button>
                        <Button icon color="red" labelPosition='right'   onClick={this.deleteSale} >
                            Delete
                         </Button>
                        
                    </Modal.Actions>
                </Modal>



            </div>
        )
    }














}