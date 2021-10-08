import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import history from "../routes/history";
import { getProductPrice } from "../helpers";

const StyledCardWrapper = styled.div`
  width: 33%;
  margin: 2px;
  
  &:hover {
    cursor: ${(state) => state.instock === true ? 'pointer' : 'not-allowed'};
  }
`;

const CustomImage = styled.img`
  width: 100%;
  height: 50%;
  object-fit: scale-down;
  opacity: ${(state) => state.instock === true ? '1' : '0.3'};
`
const OutOfStockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
`;

const ImageWrapper = styled.div`
  position: relative;
  text-align: center;
`

class Card extends Component {
    render() {
        return (
            <StyledCardWrapper
                instock={this.props?.product?.inStock}
                onClick={() => this.props?.product?.inStock && history.push(`/product/${this.props.product.id}`, this.props.product)}
            >
                <ImageWrapper>
                    <CustomImage src={this.props.product?.gallery[0]} alt="item" instock={this.props?.product?.inStock}/>
                    {!this.props?.product?.inStock &&
                        <OutOfStockOverlay>OUT OF STOCK</OutOfStockOverlay>
                    }
                </ImageWrapper>
                <div>
                    <div>{this.props.product.brand}</div>
                    <h3>{getProductPrice(this.props.product.prices, this.props.currency)}</h3>
                </div>
            </StyledCardWrapper>
        )
    }
}

export default connect((state) => ({
    currency: state.shop.currency,
}), null)(Card);
