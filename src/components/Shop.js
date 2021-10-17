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
        try {
            const { category } = this.props?.match?.params;
            const categoryQuery = GET_PRODUCTS_BY_CATEGORY(category);
            const productResult = await client
                .query({
                    query: gql`${categoryQuery}`
                });
            this.props.getProductsByCategory(productResult?.data?.category?.products, category);


            this.setState((prevState) => ({
                ...prevState,
                category,
            }))
        } catch (e) {
            console.error(e);
        }
    }
    componentDidMount = () => {
        this.getItemsByCategory();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { category } = this.props?.match?.params;
        if(prevState.category !== category && !this.props.products[category]) {
           this.getItemsByCategory();
        }
    }

    capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    render() {
        return (
            <div>
                {this.props?.products[this.state?.category]?
                    <div>
                        <Title>{this.capitalizeFirstLetter(this.state.category)}</Title>
                        <ProductContainer>
                            {this.props?.products[this.state?.category]?.map((product, index) => (
                                <Card product={product} key={index}/>
                            ))}
                        </ProductContainer>
                        {this.props.showCartOverlay && <StyledOverlay onClick={() => this.props.handleShowCartOverlay()}/>}
                    </div>:
                    <h1>No products available</h1>
                }
            </div>

        );
    }
}

export default connect((state) => ({
    products: state.shop.products,
    showCartOverlay: state.shop.showCartOverlay,
}), { getProductsByCategory, handleShowCartOverlay, getCurrencies })(withRouter(Shop));
