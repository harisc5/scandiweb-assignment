import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import history from "../routes/history";
import { getProductPrice } from "../helpers";
import AddToCartIcon from '../assets/add-to-cart-icon.svg';
import { addItemToCart } from "../redux/shop/actions";

const StyledCardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 7%;
  height: 444px;
  width: 386px;
  padding: 16px;
  color: ${(state) => state.instock ? '#1D1F22' : '#8D8F9A'};

  &:hover {
    cursor: ${(state) => state.instock === true ? 'pointer' : 'not-allowed'};
    box-shadow: 0 4px 35px rgba(168, 172, 176, 0.19);
  }

  &:hover .add-to-cart {
    cursor: pointer;
    display: flex;
  }
`;

const CustomImage = styled.img`
  height: 330px;
  width: 354px;
  object-fit: contain;
  border-radius: 0;
  opacity: ${(state) => state.instock ? '1' : '0.5'};
`

const OutOfStockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #8D8F9A;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 38px;
  letter-spacing: 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  text-align: left;
  padding: 20px;
`

const AddToCartImage = styled.img`
  display: none;
  position: absolute;
  right: 30px;
  bottom: 40px;
  transform: translate(50%, -50%);
  align-items: center;
  justify-content: center;
  opacity: ${(state) => state.instock ? '1' : '0.3'};
`;

const ProductInfoWrapper = styled.div`
  padding: 0 20px;
`;

const ProductBrandName = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 18px;
  line-height: 160%;
  display: flex;
  align-items: center;
  letter-spacing: 0px;
  text-align: left;
`;

const Price = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 160%;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

class Card extends Component {

    constructor(props) {
        super(props);
        this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
    }

    handleAddToCartClick = (e) => {
        if(this.props.product.attributes.length) {
            history.push(`/product/${this.props.product.id}`, this.props.product.id);
        } else {
            this.props.addItemToCart({
                product: this.props.product,
                attributes: this.props.product.attributes
            })
        }
        e.stopPropagation();
    }

    render() {
        return (
            <StyledCardWrapper
                instock={this.props?.product?.inStock}
                onClick={() => this.props?.product?.inStock && history.push(`/product/${this.props.product.id}`, this.props.product.id)}
            >
                <ImageWrapper>
                    <CustomImage src={this.props.product?.gallery[0]} alt="item" instock={this.props?.product?.inStock}/>
                    {!this.props?.product?.inStock &&
                        <OutOfStockOverlay>OUT OF STOCK</OutOfStockOverlay>
                    }
                </ImageWrapper>
                {this.props?.product?.inStock &&
                        <AddToCartImage
                             className="add-to-cart"
                             instock={this.props?.product?.inStock}
                             src={AddToCartIcon}
                             alt="add-to-cart"
                             height="52px"
                             width="52px"
                             onClick={(e) => this.handleAddToCartClick(e)}
                        />
                }
                <ProductInfoWrapper>
                    <ProductBrandName>{this.props.product.brand}</ProductBrandName>
                    <ProductBrandName>{this.props.product.name}</ProductBrandName>
                    <Price>{getProductPrice(this.props.product.prices, this.props.currency)}</Price>
                </ProductInfoWrapper>
            </StyledCardWrapper>
        )
    }
}

export default connect((state) => ({
    currency: state.shop.currency,
}), { addItemToCart })(Card);
