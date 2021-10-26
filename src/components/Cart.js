import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { decreaseProductAmount, handleShowCartOverlay, increaseProductAmount } from "../redux/shop/actions";
import { StyledOverlay } from "../shared-components";
import { getProductPrice } from "../helpers";

const SizeContainer = styled.span`
  width: 63px;
  height: 45px;
  border: 1px solid #1D1F22;
  box-sizing: border-box;
  margin: 5px;
  color: ${(props) => (props.selected ? '#FFFFFF ' : '#1D1F22')};
  background-color: ${(props) => (props.selected ? '#1D1F22 ' : '#FFFFFF')};
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-align: center;
  padding: 12px 26px 15px 28px;
`;

const Header = styled.div`
  font-size: 32px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0;
  text-align: left;
  margin-bottom: 59px;
  margin-top: 80px;
`;

const BreakLine = styled.hr`
  border: 1px solid #E9E9E9;
  width: 100%;
  margin-top: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomButton = styled.button`
  height: 12px;
  width: 6px;
  align-self: center;
  border: unset;
  background: #FFFF;
  
  &:hover{
    cursor: pointer;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AttributeName = styled.div`
  margin: 20px 5px;
`;

const ProductBrand = styled.p`
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  letter-spacing: 0;
  text-align: left;
`;

const ProductName = styled.p`
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0;
  text-align: left;
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0;
  text-align: left;

`;

const QuantityHeader = styled.p`
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 38px;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 30px;
`;

const CustomImage = styled.img`
  height: 185px;
  width: 141px;
  object-fit: contain;
  align-self: center;
`;

const CustomButtonIncreaseDecrease = styled.button`
  border: 1px solid #1D1F22;
  box-sizing: border-box;
  height: 45px;
  width: 45px;
  background: #FFFF;

  &:hover{
    cursor: pointer;
  }
`;

class Cart extends Component {
    constructor(props) {
        super(props);
        this.updateCurrentProductImage = this.updateCurrentProductImage.bind(this);
        this.state = {
            activeImages: []
        }
    }

    componentDidMount() {
        let productIndexes = [];
        this.props.cart.forEach(() => {
            productIndexes.push(0);
        })

        this.setState({
            activeImages: productIndexes
        })
    }

    updateCurrentProductImage = (index, numberOfImages, increase = true) => {
        const activeImagesCopy = [...this.state.activeImages];

        if(increase) {
            if((numberOfImages - 1) !== this.state.activeImages[index]) {
                activeImagesCopy[index] = activeImagesCopy[index] + 1;
            } else {
                activeImagesCopy[index] = 0;
            }
        } else {
            if(this.state.activeImages[index] !== 0) {
                activeImagesCopy[index] = activeImagesCopy[index] - 1;
            } else {
                activeImagesCopy[index] = numberOfImages - 1;
            }
        }

        this.setState({
            activeImages: activeImagesCopy
        })
    }

    render() {
        return (
            <div>
                {!!this.props.cart.length ?
                    <>
                        <Header>CART</Header>
                        <div>
                            {this.props.cart.map(({ item: cartItem, quantity }, index) => (
                                <Fragment key={index}>
                                    <BreakLine/>
                                    <FlexContainer>
                                        <div>
                                            <ProductBrand>
                                                {cartItem.product.brand}
                                            </ProductBrand>
                                            <ProductName>
                                                {cartItem.product.name}
                                            </ProductName>
                                            <ProductPrice>
                                                {getProductPrice(cartItem.product.prices, this.props.currency)}
                                            </ProductPrice>
                                            {!!cartItem?.product?.attributes?.length &&
                                                <>
                                                    <div>
                                                        {cartItem?.product?.attributes?.map((attribute, sizeIndex) => (
                                                            <Fragment key={sizeIndex}>
                                                                <AttributeName>{attribute.name.toUpperCase()}</AttributeName>
                                                                {attribute?.items?.map((item, itemIndex) => (
                                                                    <SizeContainer
                                                                        key={itemIndex}
                                                                        selected={cartItem?.attributes[attribute?.id] === item?.id}
                                                                    >
                                                                        {item?.displayValue}
                                                                    </SizeContainer>
                                                                ))}
                                                            </Fragment>
                                                        ))}
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <ImageWrapper>
                                            <ButtonWrapper>
                                                <CustomButtonIncreaseDecrease
                                                    onClick={() => this.props.increaseProductAmount(cartItem.product?.id, cartItem.attributes)}
                                                >
                                                    +
                                                </CustomButtonIncreaseDecrease>
                                                <QuantityHeader>{quantity}</QuantityHeader>
                                                <CustomButtonIncreaseDecrease
                                                    onClick={() =>
                                                        this.props.decreaseProductAmount(cartItem.product.id, cartItem.attributes)}
                                                >
                                                    -
                                                </CustomButtonIncreaseDecrease>
                                            </ButtonWrapper>
                                            <CustomButton
                                                onClick={() => this.updateCurrentProductImage(index, cartItem.product.gallery.length, false)}
                                                borderunset
                                            >{'<'}</CustomButton>
                                                <CustomImage
                                                src={cartItem.product.gallery[this.state.activeImages[index]]}
                                                alt="product"
                                            />
                                            <CustomButton
                                                onClick={() => this.updateCurrentProductImage(index, cartItem.product.gallery.length)}
                                                borderunset
                                            >{'>'}</CustomButton>
                                        </ImageWrapper>
                                    </FlexContainer>
                                </Fragment>
                            ))}
                        </div>
                    </> :
                    <Header>No items in the cart</Header>
                }
                {this.props.showCartOverlay && <StyledOverlay onClick={() => this.props.handleShowCartOverlay()}/>}
            </div>
        );
    }
};

export default connect((state) => ({
    cart: state.shop.cart.items,
    currency: state.shop.currency,
    showCartOverlay: state.shop.showCartOverlay,
}), { increaseProductAmount, decreaseProductAmount, handleShowCartOverlay })(Cart);
