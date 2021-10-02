import React, { Component } from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import { connect } from "react-redux";
import Card from "./Card";
import client from "../apollo-client";
import { addAllProducts, handleShowCartOverlay } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";

const Title = styled.h1`
  text-align: left;
  color: black;
  padding: 20px;
`;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

class Shop extends Component {

    componentDidMount = () => {
        (async () => {
            const result = await client
                .query({
                    query: gql`
                    query getClothes {
                          categories {
                            name
                            products {
                              description
                              brand
                              id
                              gallery
                              inStock
                              category
                              prices {
                                amount,
                                currency
                              }
                              attributes {
                                name,
                                id,
                                items {
                                  displayValue,
                                  value,
                                  id
                                }
                              }
                            }
                          }
                        }
                    `
                });
            this.props.addAllProducts(result.data.categories);
        })();
    }

    render() {
        return (
            <div>
                <Title>Clothes</Title>
                <ProductContainer>
                    {this.props.products?.clothes?.map((product, index) => (
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
}), { addAllProducts, handleShowCartOverlay })(Shop);
