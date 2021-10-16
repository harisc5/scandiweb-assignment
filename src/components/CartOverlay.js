import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { decreaseProductAmount, handleShowCartOverlay, increaseProductAmount } from "../redux/shop/actions";
import history from "../routes/history";
import { getNumberOfItemsInCart, getProductPrice, stringContainsDangerousTags } from "../helpers";
import { TextCenter } from "../shared-components";

const StyledCartOverlay = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  z-index: 1;
  width: 350px;
  background-color: white;
  padding: 5px;
`;

const SizeContainer = styled.span`
  border: 1px solid black;
  font-size: 14px;
  margin: 1px;
  padding: 5px;
  color: black;
  background-color: ${(props) => (props.selected ? 'white ': '#A6A6A6')};
  opacity: ${(props) => (props.selected ?  1 : 0.5)};
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  padding: 10px 2px;
`;

const Description = styled.div`
  font-size: 12px;
  padding: 10px 2px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomButton = styled.button`
  padding: 5px 10px;
  border: ${(props => props.borderunset ? 'unset': '')};
  background-color: ${(props => props.backgroundcolor ? props.backgroundcolor : 'white')};
  color: ${(props => props.textcolor ? props.textcolor : 'black')};
  
  &:hover{
    cursor: pointer;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StyledImage = styled.img`
  align-self: center;
`;

const AttributesFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

`;

const AttributeName = styled.div`
  margin: 20px 0;
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
        this.props.cart.forEach(({ item, quantity }) => {
            let price = getProductPrice(item.product.prices, this.props.currency);
            currency = price.substring(0,1);
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
                        <Header>My bag, {getNumberOfItemsInCart(this.props.cart)} items</Header>
                        <div>
                            {this.props.cart.map(({ item: cartItem, quantity }, index) => (
                                <Fragment key={index}>
                                    <FlexContainer>
                                        <div>
                                            <Header>
                                                {cartItem.product.brand}
                                            </Header>
                                            <Header>
                                                {cartItem.product.name}
                                            </Header>
                                            {!stringContainsDangerousTags(this.state?.product?.description) &&
                                                <Description>
                                                    {ReactHtmlParser(this.state.product?.description)}
                                                </Description>
                                            }
                                            <Header>
                                                {getProductPrice(cartItem.product.prices, this.props.currency)}
                                            </Header>
                                            <AttributesFlexContainer>
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
                                                <TextCenter>{quantity}</TextCenter>
                                                <CustomButton onClick={() =>
                                                    this.props.decreaseProductAmount(cartItem?.product?.id, cartItem?.attributes)}
                                                >
                                                    -
                                                </CustomButton>
                                            </ButtonWrapper>
                                            <StyledImage
                                                width="60px"
                                                height="60px"
                                                src={cartItem.product.gallery[0]}
                                                alt="product"
                                            />
                                        </ImageWrapper>
                                    </FlexContainer>
                                </Fragment>
                            ))}
                        </div>
                        <FlexContainer>
                            <CustomButton onClick={() => {
                                this.props.handleShowCartOverlay();
                                history.push('/cart');
                            }}
                            >
                                VIEW BAG
                            </CustomButton>
                            <CustomButton
                                backgroundcolor={"#5ECE7B"}
                                textcolor={'white'}
                                borderunset
                                onClick={() => alert('THANK YOU FOR BUYING')}
                            >
                                CHECKOUT
                            </CustomButton>
                        </FlexContainer>
                        <FlexContainer>
                            <Header>Total</Header>
                            <Header>{this.calculateTotalPrice()}</Header>
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
}), { increaseProductAmount, decreaseProductAmount, handleShowCartOverlay })(CartOverlay);
