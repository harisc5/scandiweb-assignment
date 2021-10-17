import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { gql } from "@apollo/client";
import ReactHtmlParser from 'react-html-parser';
import { addItemToCart, handleShowCartOverlay } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";
import { getProductPrice, stringContainsDangerousTags} from "../helpers";
import { GET_PRODUCT_BY_ID } from "../queries";
import client from "../apollo-client";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.flexdirection ? props.flexdirection : 'row')};
  justify-content: space-evenly;
  max-width: ${(props) => (props.maxwidth ? props.maxwidth : '')};
  padding-top: 20px;
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
  max-width: 300px;
`;

const ImageListContainer = styled.div`
  padding: 10px;
`

const CustomImage = styled.img`
  width: 79px;
  height: 80px;
`;

class PDP extends Component {
    constructor(props) {
        super(props);
        this.handleAttributes = this.handleAttributes.bind(this);
        this.state = {
            product: {},
            primaryImage: "",
            chosenSizes: [],
            attributes: {},
            disabled: true
        }
    }

    componentDidMount() {
        (async () => {
            try {
                const id = this.props?.history?.location?.state;
                const {data} = await client
                    .query({
                        query: gql`${GET_PRODUCT_BY_ID(id)}`
                    });
                if (data) {
                    this.setState(prevState => ({
                        ...prevState,
                        product: data?.product,
                        disabled: !!data?.product?.attributes,
                        primaryImage: data?.product?.gallery[0]
                    }))
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.disabled){
            if(this.state?.product?.attributes?.length === Object.keys(this.state?.attributes)?.length) {
                this.setState(prevState => ({
                    ...prevState,
                    disabled: false
                }))
            }
        }
    }

    handleAttributes = (property, value) => {
        let attributesCopy = {...this.state.attributes};
        attributesCopy[property] = value;
        this.setState(prevState => ({
            ...prevState,
            attributes: attributesCopy
        }))
    }

    render() {
        return (
          <FlexContainer>
            <ImageListContainer>
                {this.state.product?.gallery?.map((image, index) => (
                    <ImageWrapper onClick={() => this.setState((state) => ({...state, primaryImage: image}))} key={index}>
                        <CustomImage src={image} alt="product" />
                    </ImageWrapper>
                ))}
            </ImageListContainer>
              <div>
                  <img src={this.state?.primaryImage} alt="primary"/>
              </div>
              <div>
                  <div>
                      <StyledSizeHeader>{this.state?.product?.brand}</StyledSizeHeader>
                      <StyledSizeHeader>{this.state?.product?.name}</StyledSizeHeader>
                  </div>
                  <FlexContainer flexdirection="column" maxwidth="500px">
                      {!!this.state?.product?.attributes?.length &&
                          <>
                              <div>
                                  {this.state?.product?.attributes?.map((attribute, sizeIndex) => (
                                      <Fragment key={sizeIndex}>
                                          <StyledSizeHeader>{attribute.name.toUpperCase()}</StyledSizeHeader>
                                          {attribute?.items.map((item, itemIndex) => (
                                              <SizeContainer
                                                  key={itemIndex}
                                                  selected={this.state.attributes[attribute?.id] === item?.id}
                                                  onClick={() => this.handleAttributes(attribute?.id, item?.id)}
                                              >
                                                  {item?.displayValue}
                                              </SizeContainer>
                                          ))}
                                      </Fragment>
                                  ))}
                              </div>
                          </>
                      }
                      <PriceContainer>
                          <h4>PRICE:</h4>
                          <h2>{getProductPrice(this.state.product?.prices, this.props.currency)}</h2>
                      </PriceContainer>
                      <StyledButton
                          onClick={() => this.props.addItemToCart({
                          product: this.state.product,
                          attributes: this.state.attributes
                          })}
                          disabled={this.state.disabled}
                      >
                          ADD TO CART
                      </StyledButton>
                      {!stringContainsDangerousTags(this.state?.product?.description) &&
                          <StyledDescription>
                              {ReactHtmlParser(this.state.product?.description)}
                          </StyledDescription>
                      }
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
