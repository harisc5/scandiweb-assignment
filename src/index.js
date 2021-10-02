import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import { Routes } from "./routes";
import Navbar from "./components/Navbar";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <Navbar/>
            <Routes/>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);
