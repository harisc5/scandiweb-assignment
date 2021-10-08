import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import { Routes } from "./routes";
import Navbar from "./components/Navbar";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";
import GlobalStyle from "./globalStyles";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <GlobalStyle/>
            <Navbar/>
            <Routes/>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);
