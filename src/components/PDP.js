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
  box-sizing: border-box;
  padding: 13px 27px 14px 27px ;
  color:  ${(props) => (props.selected ? '#FFFFFF ': '#1D1F22')};
  background-color:  ${(props) => (props.selected ? '#1D1F22 ': '#FFFFFF')};
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-align: center;
  margin-right: 12px;
  
  &:hover {
    cursor: pointer;
  }
`;

const StyledSizeHeader = styled.p`
  min-width: 38px;
  height: 18px;
  font-family: 'Roboto Condensed', sans-serif;
  font-style: normal;
  font-size: 18px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1D1F22;
  font-weight: 700;
  letter-spacing: 0;
`

const PriceContainer = styled.div`
  //margin: 5px;
`;

const StyledButton = styled.div`
  font-size: 16px;
  background-color: ${(props) => (props.disabled ? '#A6A6A6 ': '#5ECE7B')};
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  width: 292px;
  height: 52px;
  font-style: normal;
  font-weight: 600;
  line-height: 19px;
  letter-spacing: 0;

  &:hover:not([disabled]) {
    cursor: pointer;
  }
`;

const StyledDescription = styled.div`
  height: 103px;
  width: 292px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0;
  text-align: left;
`;

const ImageListContainer = styled.div`
  padding: 10px;
`

const CustomImage = styled.img`
  height: 87.60px;
  width: 176.65px;
  object-fit: contain;
`;

const PrimaryImage = styled.img`
  height: 511px;
  width: 610px;
  object-fit: contain;
`;

const ProductBrand = styled.p`
  width: 292px;
  height: 27px;
  font-family: 'Raleway', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 27px;
  display: flex;
  align-items: center;
  color: #1D1F22;
`;

const ProductName = styled.p`
  width: auto;
  height: 27px;
  font-family: 'Raleway', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 27px;
  display: flex;
  align-items: center;
  color: #1D1F22;
`;

const PriceText = styled.p`
  width: 50px;
  height: 18px;
  font-family: 'Roboto Condensed', sans-serif;
  font-style: normal;
  font-size: 18px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #1D1F22;
  font-weight: 700;
  letter-spacing: 0;
`;

const ProductAmount = styled.p`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
`

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
                  <PrimaryImage src={this.state?.primaryImage} alt="primary"/>
              </div>
              <div>
                  <div>
                      <ProductBrand>{this.state?.product?.brand}</ProductBrand>
                      <ProductName>{this.state?.product?.name}</ProductName>
                  </div>
                  <FlexContainer flexdirection="column" maxwidth="500px">
                      {!!this.state?.product?.attributes?.length &&
                          <>
                              <div>
                                  {this.state?.product?.attributes?.map((attribute, sizeIndex) => (
                                      <div key={sizeIndex}>
                                          <StyledSizeHeader>{attribute.name.toUpperCase()}:</StyledSizeHeader>
                                          {attribute?.items.map((item, itemIndex) => (
                                              <SizeContainer
                                                  key={itemIndex}
                                                  selected={this.state.attributes[attribute?.id] === item?.id}
                                                  onClick={() => this.handleAttributes(attribute?.id, item?.id)}
                                              >
                                                  {item?.displayValue}
                                              </SizeContainer>
                                          ))}
                                      </div>
                                  ))}
                              </div>
                          </>
                      }
                      <PriceContainer>
                          <PriceText>PRICE:</PriceText>
                          <ProductAmount>{getProductPrice(this.state.product?.prices, this.props.currency)}</ProductAmount>
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
