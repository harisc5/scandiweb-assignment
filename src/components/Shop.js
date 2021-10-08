import React, { Component } from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Card from "./Card";
import client from "../apollo-client";
import { getCurrencies, getProducts, handleShowCartOverlay } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";
import { GET_PRODUCTS } from "../queries";

const Title = styled.h1`
  text-align: left;
  color: black;
  padding: 20px;
  font-size: 42px;
  font-weight: 400;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

class Shop extends Component {

    constructor(props) {
        super(props);

        this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);

        this.state = {
            items: [],
            category: ''
        }
    }
    componentDidMount = () => {
        (async () => {
            const productResult = await client
                .query({
                    query: gql`${GET_PRODUCTS}`
                });
            this.props.getProducts(productResult?.data?.categories);

            const { category } = this.props?.match?.params;

            this.setState((prevState) => ({
                ...prevState,
                category,
            }))
        })();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { category } = this.props?.match?.params
        // console.log('updated', this.props?.match?.params)
        // console.log('prev state ', prevState)
        if(prevState.category !== category) {
            this.setState({
                ...prevState,
                category,
            })
        }
    }

    capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);


    render() {
        return (
            <div>
                <Title>{this.capitalizeFirstLetter(this.state.category)}</Title>
                <ProductContainer>
                    {this.props.products[this.state.category]?.map((product, index) => (
                        <Card product={product} key={index}/>
                    ))}
                </ProductContainer>
                {this.props.showCartOverlay && <StyledOverlay onClick={() => this.props.handleShowCartOverlay()}/>}
            </div>
        );
    }
}

export default connect((state) => ({
    products: state.shop.products,
    showCartOverlay: state.shop.showCartOverlay,
}), { getProducts, handleShowCartOverlay, getCurrencies })(withRouter(Shop));
