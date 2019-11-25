import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Modal, Form, Header, Button, FormItem, Divider, Icon, Font } from "semantic-ui-react";
import { faTrash, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';


export default class Product extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showCreate: false,
            showDelete: false,
            showEdit: false,
            productName: '',
            productPrice: '',
            listOfProducts: [],
            activeProductId: 0,

        }
        
    }

    openCreateModal = () => {
        this.setState({
            showCreate: true,
            productName: '',
            productPrice: ''
        });

    }

    closeCreateModal = () => {
        this.setState({
            showCreate: false
        });

    }

    openDeleteModal(id) {
        this.setState({
            showDelete: true,
            activeProductId: id
        });

    }

    closeDeleteModal = () => {
        this.setState({
            showDelete: false
        });
    }

    openEditModal(id) {
        this.getProductById(id);
        this.setState({
            showEdit: true,
        });
    }

    closeEditModal = () => {
        this.setState({
            showEdit: false
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
        if ((this.state.listOfProducts !== prevState.listOfProducts) && prevState.listOfProducts.length > 0) {

            this.getAllProductDetails()

        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            showCreate: false
        });
        this.setState({
            showEdit: false
        });

        const prodData = {
            id: this.state.activeProductId,
            name: this.state.productName,
            price: this.state.productPrice,
        }
        console.log(prodData)

        axios({
            method: 'post',
            url: '/Product/Create',
            data: prodData
        })
            .then(res => {
                this.setState({
                    activeProductId: 0,
                    productName: '',
                    productPrice: ''
                })
                console.log(res);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.getAllProductDetails();
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

    getProductById(id) {

        axios({
            method: 'get',
            url: '/Product/Details/' + id,
        })
            .then(res => {
                this.setState({
                    activeProductId: id,
                    productName: res.data.Name,
                    productPrice: res.data.Price
                });
                console.log("get" + res.data.Price);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteProduct = () => {
        this.setState({
            showDelete: false
        });
        const id = this.state.activeProductId;
        axios({
            method: 'post',
            url: '/Product/Delete/' + id
        })
            .then(res => {
                this.setState(previousState => {
                    return {
                        listOfProducts: previousState.listOfProducts.filter(p => p.Id !== id)
                    };
                });
            }
            )
            .catch(function (error) {
                console.log(error);
            });
    }


    createProductTableData = () => {

        let productList = []
        productList = this.state.listOfProducts;

        if (productList.length > 0) {
            return (
                productList.map(prod =>
                    <tr key={prod.Id}>
                        <td className="two wide" style={{ height: '20%' }}>{prod.Name}</td>
                        <td className="two wide" >{prod.Price}</td>
                        <td className="two wide" >
                            <Button color="orange"  onClick={() => this.openEditModal(prod.Id)}>
                            <FontAwesomeIcon icon={faEdit} />Edit
                            </Button>
                            <Button color="red" content="Delete" onClick={() => this.openDeleteModal(prod.Id)}>
                                <FontAwesomeIcon icon={faTrash} />Delete
                         </Button>
                        </td>
                    </tr>
                )

            )
        } else {
            this.getAllProductDetails();
            if (this.state.listOfProducts.length > 0) {
                return (
                    this.state.listOfProducts.map(prod =>
                        <tr key={prod.Id}>
                            <td className="two wide" >{prod.Name}</td>
                            <td className="ten wide">{prod.Price}</td>
                            <td className="four wide" >
                                <Button color="orange" content="Edit" onClick={() => this.openEditModal(prod.Id)} />
                                <Button color="red" content="Delete" onClick={() => this.openDeleteModal(prod.Id)} />
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
                <button class="ui blue button"  onClick={this.openCreateModal}>
                    <FontAwesomeIcon icon={faPlusSquare} />NewProduct
                </button>

                <React.Fragment>
                    <table className="ui striped table" style={{ width: '50%' }}>
                        <thead>
                            <tr>
                                <th className="two wide">Name</th>
                                <th className="two wide">Price</th>
                                <th className="two wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createProductTableData()}
                        </tbody>
                    </table>
                </React.Fragment>

                <Modal size='tiny' open={this.state.showCreate} >
                    <Header content="Create Product" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input label="Name" value={this.state.productName} required type="text" name="productName" placeholder="Name" onChange={this.handleChange} />
                            <Form.Input label="Price" value={this.state.productPrice} required type="text" name="productPrice" placeholder="Price" onChange={this.handleChange} />

                            <Button color="black" content="Close" onClick={this.closeCreateModal}></Button>
                            <Button color="teal" type="primary" htmlType="submit">Create</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

                <Modal size='tiny' open={this.state.showEdit} >
                    <Header content="Edit Product" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input value={this.state.activeProductId} type="hidden" required name="activeProductId" />
                            <Form.Input label="Name" value={this.state.productName} type="text" required name="productName" onChange={this.handleChange} />
                            <Form.Input label="Address" value={this.state.productPrice} type="text" required name="productPrice" onChange={this.handleChange} />

                            <Button color="black" content="Close" onClick={this.closeEditModal} />
                            <Button color="teal" type="primary" htmlType="submit">Edit</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

                <Modal size='tiny' open={this.state.showDelete}>
                    <Modal.Header>Delete Product</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" content="Close" onClick={this.closeDeleteModal} />
                        <Button color="red" labelPosition='right' icon={<Icon name='trash' />} content='delete' onClick={this.deleteProduct} />
                    </Modal.Actions>
                </Modal>


            </div>
        )
    }


}