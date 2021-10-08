import React, { Component } from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Card from "./Card";
import client from "../apollo-client";
import { getCurrencies, getProductsByCategory, handleShowCartOverlay } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";
import { GET_PRODUCTS_BY_CATEGORY } from "../queries";

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

    getItemsByCategory = async () => {
        const { category } = this.props?.match?.params;
        const categoryQuery = GET_PRODUCTS_BY_CATEGORY(category);
        // console.log('category ', categoryQuery);
        const productResult = await client
            .query({
                query: gql`${categoryQuery}`
            });
        // console.log('product result', productResult?.data?.category);
        this.props.getProductsByCategory(productResult?.data?.category?.products, category);


        this.setState((prevState) => ({
            ...prevState,
            category,
        }))
    }
    componentDidMount = () => {
        this.getItemsByCategory();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { category } = this.props?.match?.params
        console.log('category', category);
        if(prevState.category !== category && !this.props.products[category]) {
            console.log('update');
           this.getItemsByCategory();
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
}), { getProductsByCategory, handleShowCartOverlay, getCurrencies })(withRouter(Shop));
