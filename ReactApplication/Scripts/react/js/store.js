import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Modal, Form, Header, Button, FormItem, Divider, Icon, Font } from "semantic-ui-react";
import { faTrash, faEdit, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';


export default class Store extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showCreate: false,
            showDelete: false,
            showEdit: false,
            storeName: '',
            storeAddress: '',
            listOfStores: [],
            activeStoreId: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.getAllStoreData = this.getAllStoreData.bind(this);
    }

    openCreateModal = () => {
        this.setState({
            showCreate: true,
            storeName: '',
            storeAddress: ''
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
            activeStoreId: id
        });
    }

    closeDeleteModal = () => {
        this.setState({
            showDelete: false
        });
    }

    openEditModal(id) {
        this.getStoreById(id);
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

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            showCreate: false
        });
        this.setState({
            showEdit: false
        });
        const storeData = {
            id: this.state.activeStoreId,
            name: this.state.storeName,
            address: this.state.storeAddress,
        }

        axios({
            method: 'post',
            url: '/Stores/Create',
            data: storeData
        })
            .then(res => {
                this.setState({
                    activeStoreId: 0,
                    storeName: '',
                    storeAddress: ''
                })
                console.log(this.state.activeStoreId);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.getAllStoreData();
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

    getStoreById(id) {

        axios({
            method: 'get',
            url: '/Stores/Details/' + id,
        })
            .then(res => {
                this.setState({
                    activeStoreId: id,
                    storeName: res.data.Name,
                    storeAddress: res.data.Address
                });
                console.log("get" + res.data.Address);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    deleteStore = () => {
        this.setState({
            showDelete: false
        });
        const id = this.state.activeStoreId;

        axios({
            method: 'post',
            url: '/Stores/Delete/' + id
        })
            .then(res => {
                this.setState(previousState => {
                    return {
                        listOfStores: previousState.listOfStores.filter(s => s.Id !== id)
                    };
                });
            }
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    createStoreTableData = () => {

        let storeList = []
        storeList = this.state.listOfStores;

        if (storeList.length > 0) {
            return (
                storeList.map(store =>
                    <tr key={store.Id}>
                        <td className="two wide" style={{ height: '20%' }}>{store.Name}</td>
                        <td className="two wide" >{store.Address}</td>
                        <td className="two wide" >
                            <Button color="orange" content="Edit" onClick={() => this.openEditModal(store.Id)}>
                                <FontAwesomeIcon icon={faEdit} />Edit
                            </Button>
                            <Button color="red" content="Delete" onClick={() => this.openDeleteModal(store.Id)}>
                            <FontAwesomeIcon icon={faTrash} />Delete
                         </Button>
                        </td>
                    </tr>
                )

            )
        } else {
            this.getAllStoreData();
            if (this.state.listOfStores.length > 0) {
                return (
                    this.state.listOfStores.map(st =>
                        <tr key={st.Id}>
                            <td className="two wide" >{st.Name}</td>
                            <td className="ten wide">{st.Address}</td>
                            <td className="four wide" >
                                <Button color="orange" content="Edit" onClick={() => this.openEditModal(st.Id)} />
                                <Button color="red" content="Delete" onClick={() => this.openDeleteModal(st.Id)} />
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
                <button class="ui blue button" id="bt" onClick={this.openCreateModal}>
                <FontAwesomeIcon icon={faPlusSquare} />NewStore
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
                            {this.createStoreTableData()}
                        </tbody>
                    </table>
                </React.Fragment>

                <Modal size='tiny' open={this.state.showCreate} >
                    <Header content="Create Store" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input label="Name" value={this.state.storeName} required type="text" name="storeName" placeholder="Name" onChange={this.handleChange} />
                            <Form.Input label="Address" value={this.state.storeAddress} required type="text" name="storeAddress" placeholder="Address" onChange={this.handleChange} />

                            <Button color="black" content="Close" onClick={this.closeCreateModal}><i class="sign in icon"></i></Button>
                            <Button color="teal" type="primary" htmlType="submit">Create</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

                <Modal size='tiny' open={this.state.showDelete}>
                    <Modal.Header>Delete Store</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" content="Close" onClick={this.closeDeleteModal} />
                        <Button color="red" labelPosition='right' icon={<Icon name='trash' />} content='delete' onClick={this.deleteStore} />
                    </Modal.Actions>
                </Modal>

                <Modal size='tiny' open={this.state.showEdit} >
                    <Header content="Edit Store" as="h3" />
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Input value={this.state.activeStoreId} type="hidden" name="activeStoreId" />
                            <Form.Input label="Name" value={this.state.storeName} type="text" name="storeName" onChange={this.handleChange} />
                            <Form.Input label="Address" value={this.state.storeAddress} type="text" name="storeAddress" onChange={this.handleChange} />

                            <Button color="black" content="Close" onClick={this.closeEditModal} />
                            <Button color="teal" type="primary" htmlType="submit">Edit</Button>

                        </Form>
                    </Modal.Content>

                </Modal>

            </div>
        )
    }


}