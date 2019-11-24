import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from "react-router-dom";
import Cust from './js/customer';
import Product from './js/product';
import Store from './js/store';
import Sale from './js/sales';



if (window.location.pathname === '/Customer') {
    ReactDOM.render(<Cust />, document.getElementById('root'));
} else if (window.location.pathname === '/Product') {
    ReactDOM.render(<Product />, document.getElementById('root2'));
} else if (window.location.pathname === '/Stores') {
    ReactDOM.render(<Store />, document.getElementById('root3'));
} else if (window.location.pathname === '/Sales') {
    ReactDOM.render(<Sale />, document.getElementById('root4'));
}