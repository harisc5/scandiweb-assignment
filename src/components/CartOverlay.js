import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import styled from "styled-components";
import {decreaseProductAmount, handleShowCartOverlay, increaseProductAmount} from "../redux/shop/actions";
import history from "../routes/history";
import {getNumberOfItemsInCart, getProductPrice} from "../helpers";

const StyledCartOverlay = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  z-index: 1;
  background-color: #FFFF;
  padding: 5px;
  max-height: 540px;
  width: 325px;
  overflow-y: auto;
`;

const SizeContainer = styled.div`
  border: 1px solid #1D1F22;
  box-sizing: border-box;
  font-size: 14px;
  color: #1D1F22;
  background-color: ${(props) => (props.selected ? 'white ' : '#A6A6A6')};
  opacity: ${(props) => (props.selected ? 1 : 0.5)};
  font-family: 'Source Sans Pro', sans-serif;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0;
  //width: 30px;
  //height: 30px;
  text-align: center;
  //max-width: 40px;
  margin-right: 5px;
  align-self: center;
  padding: 1px;
`;

const Header = styled.div`
  padding: 10px 2px;
  font-style: normal;
  font-size: 16px;
  color: #1D1F22;
  display: flex;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomButton = styled.button`
  padding: 5px 10px;
  border: ${(props => props.borderunset ? 'unset' : '')};
  background-color: ${(props => props.backgroundcolor ? props.backgroundcolor : 'white')};
  color: ${(props => props.textcolor ? props.textcolor : 'black')};

  &:hover {
    cursor: pointer;
  }
`;

const CustomButtonViewBagCheckout = styled.button`
  height: 43px;
  width: 145px;
  border-radius: 0;
  font-family: 'Raleway', sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: 0;
  text-align: center;
  border: 1px solid #1D1F22;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 32px;
  color: ${(props => props.buttonType === 'viewbag' ? '#FFFFFF' : '#1D1F22')};
  background-color: ${(props => props.buttonType === 'viewbag' ? '#5ECE7B' : '#FFFFFF')};
  border: ${(props => props.buttonType === 'viewbag' ? 'unset' : '')};
  
  &:hover {
    cursor: pointer;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: ${(props => props.alignitems ? props.alignitems : '')};
  justify-content: ${(props => props.justifycontent ? props.justifycontent : '')};
`;

const StyledImage = styled.img`
  align-self: center;
  height: 137px;
  width: 105px;
  object-fit: contain;
`;

const AttributesFlexContainer = styled.div`
  display: grid;
  //flex-direction: column;
  //justify-content: space-evenly;
`;

const AttributeName = styled.div`
  width: 100%;
`;

const StaticHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0;
  text-align: right;
`;

const CartHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 26px;
  letter-spacing: 0;
`;

const PriceHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0;
`

const QuantityHeader = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0;
  text-align: center;
`;

const TotalHeader = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0;
`;

const PriceAmount = styled.p`
  font-family: 'Raleway', sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0;
`;

class CartOverlay extends Component {
    constructor(props) {
        super(props);
        this.calculateTotalPrice = this.calculateTotalPrice.bind(this);

        this.state = {
            totalAmount: 0
        }
    }

    calculateTotalPrice = () => {
        let total = 0;
        let currency = '';
        this.props.cart.forEach(({item, quantity}) => {
            let price = getProductPrice(item.product.prices, this.props.currency);
            currency = price.substring(0, 1);
            let amount = parseFloat(price.substring(1));
            total += (amount * quantity);
        });


        return `${currency} ${total.toFixed(2)}`;
    }

    render() {
        return (
            <StyledCartOverlay>
                {!!this.props.cart.length ?
                    <>
                        <Header>
                            <StaticHeader>My bag, &nbsp;</StaticHeader>
                            {getNumberOfItemsInCart(this.props.cart)} items
                        </Header>
                        <div>
                            {this.props.cart.map(({item: cartItem, quantity}, index) => (
                                <Fragment key={index}>
                                    <FlexContainer>
                                        <div style={{width: '70%'}}>
                                            <CartHeader>
                                                {cartItem.product.brand}
                                            </CartHeader>
                                            <CartHeader>
                                                {cartItem.product.name}
                                            </CartHeader>
                                            <PriceHeader>
                                                {getProductPrice(cartItem.product.prices, this.props.currency)}
                                            </PriceHeader>
                                            <AttributesFlexContainer>
                                                {!!cartItem?.product?.attributes?.length &&
                                                <>
                                                    {cartItem?.product?.attributes?.map((attribute, sizeIndex) => (
                                                        <div key={sizeIndex}>
                                                            <AttributeName>{attribute.name.toUpperCase()}</AttributeName>
                                                            <div style={{display: 'flex'}}>
                                                                {attribute?.items?.map((item, itemIndex) => (
                                                                    <SizeContainer
                                                                        key={itemIndex}
                                                                        selected={cartItem?.attributes[attribute?.id] === item?.id}
                                                                    >
                                                                        {item?.displayValue}
                                                                    </SizeContainer>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                                }
                                            </AttributesFlexContainer>
                                        </div>
                                        <ImageWrapper>
                                            <ButtonWrapper>
                                                <CustomButton
                                                    onClick={() =>
                                                        this.props.increaseProductAmount(cartItem?.product?.id, cartItem?.attributes)
                                                    }
                                                >
                                                    +
                                                </CustomButton>
                                                <QuantityHeader>{quantity}</QuantityHeader>
                                                <CustomButton onClick={() =>
                                                    this.props.decreaseProductAmount(cartItem?.product?.id, cartItem?.attributes)}
                                                >
                                                    -
                                                </CustomButton>
                                            </ButtonWrapper>
                                            <StyledImage
                                                src={cartItem.product.gallery[0]}
                                                alt="product"
                                            />
                                        </ImageWrapper>
                                    </FlexContainer>
                                </Fragment>
                            ))}
                        </div>
                        <FlexContainer justifycontent="space-between">
                            <TotalHeader>Total</TotalHeader>
                            <PriceAmount>{this.calculateTotalPrice()}</PriceAmount>
                        </FlexContainer>
                        <FlexContainer justifycontent="space-between">
                            <CustomButtonViewBagCheckout onClick={() => {
                                this.props.handleShowCartOverlay();
                                history.push('/cart');
                            }}
                            >
                                VIEW BAG
                            </CustomButtonViewBagCheckout>
                            <CustomButtonViewBagCheckout
                                buttonType="viewbag"
                                onClick={() => alert('THANK YOU FOR BUYING')}
                            >
                                CHECK OUT
                            </CustomButtonViewBagCheckout>
                        </FlexContainer>
                    </>
                    :
                    <Header>No items in the cart</Header>
                }
            </StyledCartOverlay>
        );
    }
}

export default connect((state) => ({
    cart: state.shop.cart.items,
    currency: state.shop.currency,
}), {increaseProductAmount, decreaseProductAmount, handleShowCartOverlay})(CartOverlay);
