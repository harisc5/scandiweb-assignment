import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import history from "../routes/history";
import { getProductPrice } from "../helpers";

const StyledCardWrapper = styled.div`
  width: 33%;
  //height: 300px;
  margin: 2px;
  
  &:hover {
    cursor: pointer;
  }
`;

const CustomImage = styled.img`
  width: 100%;
  height: 50%;
  object-fit: scale-down;
`

class Card extends Component {

    render(){
        return (
            <StyledCardWrapper onClick={() => history.push(`/product/${this.props.product.id}`, this.props.product)}>
                <CustomImage src={this.props.product?.gallery[0]} alt="item" />
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
