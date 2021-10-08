import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { addItemToCart, handleShowCartOverlay } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";
import { getProductPrice, removeTags } from "../helpers";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.flexdirection ? props.flexdirection : 'row')};;
  justify-content: space-evenly;
  max-width: ${(props) => (props.maxwidth ? props.maxwidth : '')};;

`;

const ImageWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
;`

const SizeContainer = styled.span`
  width: 63px;
  height: 45px;
  border: 1px solid #1D1F22;
  font-size: 18px;
  margin: 5px;
  padding: 10px;
  color:  ${(props) => (props.selected ? 'white ': 'black')};
  background-color:  ${(props) => (props.selected ? 'black ': 'white')};

  &:hover {
    cursor: pointer;
  }
`;

const StyledSizeHeader = styled.h4`
  padding-left: 5px;
`

const PriceContainer = styled.div`
  margin: 5px;
`;

const StyledButton = styled.div`
  font-size: 16px;
  background-color: ${(props) => (props.disabled ? 'gray ': '#5ECE7B')};
  color: white;
  padding: 15px;
  text-align: center;
  
  &:hover:not([disabled]) {
    cursor: pointer;
  }
`;

const StyledDescription = styled.div`
  padding-top: 30px;
  text-align: justify;
`;

const ImageListContainer = styled.div`
  padding: 10px;
`

class PDP extends Component {
    constructor(props) {
        super(props);
        const product = this.props?.history?.location?.state;
        this.state = {
            product: product,
            primaryImage: product.gallery[0],
            chosenSizes: [],
            disabled: true
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.disabled){
            if(this.state?.product?.attributes[0] && this.state.chosenSizes.length) {
                this.setState(prevState => ({
                    ...prevState,
                    disabled: false
                }))
            }
        }
    }

    render() {
        return (
          <FlexContainer>
            <ImageListContainer>
                {this.state.product.gallery.map((image, index) => (
                    <ImageWrapper onClick={() => this.setState((state) => ({...state, primaryImage: image}))} key={index}>
                        <img src={image} width="70px" height="70px" alt="product" />
                    </ImageWrapper>
                ))}
            </ImageListContainer>
              <div>
                  <img src={this.state?.primaryImage} width="300px" height="300px" alt="primary"/>
              </div>
              <div>
                  <div>
                      <StyledSizeHeader>{this.state?.product?.brand}</StyledSizeHeader>
                  </div>
                  <FlexContainer flexdirection="column" maxwidth="500px">
                      {!!this.state?.product?.attributes?.length &&
                          <>
                              <StyledSizeHeader>SIZE:</StyledSizeHeader>
                              <div>
                                  {this.state?.product?.attributes[0]?.items?.map((size, sizeIndex) => (
                                      <SizeContainer
                                      key={sizeIndex}
                                      selected={this.state.chosenSizes?.includes(size?.id)}
                                      onClick={() => this.setState(state => ({
                                      ...state,
                                      chosenSizes: [size?.id]
                                      }))}>
                                  {size?.displayValue}
                                      </SizeContainer>
                                  ))}
                              </div>
                          </>
                      }
                      <PriceContainer>
                          <h4>PRICE:</h4>
                          <h2>{getProductPrice(this.state.product.prices, this.props.currency)}</h2>
                      </PriceContainer>
                      <StyledButton
                          onClick={() => this.props.addItemToCart({
                          product: this.state.product,
                          chosenSizes: this.state.chosenSizes
                          })}
                          disabled={this.state.disabled}
                      >
                          ADD TO CART
                      </StyledButton>
                      <StyledDescription>
                          {removeTags(this.state.product.description)}
                      </StyledDescription>
                  </FlexContainer>
              </div>
              {this.props.showCartOverlay && <StyledOverlay onClick={() => this.props.handleShowCartOverlay()}/>}
          </FlexContainer>
        );
    }
}

export default connect((state) => ({
    currency: state.shop.currency,
    showCartOverlay: state.shop.showCartOverlay,
}), { addItemToCart, handleShowCartOverlay })(withRouter(PDP));
