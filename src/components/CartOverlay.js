import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { decreaseProductAmount, handleShowCartOverlay, increaseProductAmount } from "../redux/shop/actions";
import history from "../routes/history";
import { getProductPrice, removeTags } from "../helpers";
import { TextCenter } from "../shared-components";

const StyledCartOverlay = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  z-index: 1;
  width: 300px;
  background-color: white;
  padding: 5px;
`;

const SizeContainer = styled.span`
  border: 1px solid black;
  font-size: 12px;
  margin: 1px;
  padding: 5px;
  color: ${(props) => (props.selected ? 'white ': 'black')};;
  background-color: ${(props) => (props.selected ? 'black ': 'white')};;
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
  justify-content: space-between;
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

const SizeWrapper = styled.div`
  padding: 10px 2px;
`;

const StyledImage = styled.img`
  align-self: center;
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
                        <Header>My bag, {this.props.cart.length} items</Header>
                        <div>
                            {this.props.cart.map(({ item, quantity }, index) => (
                                <Fragment key={index}>
                                    <FlexContainer>
                                        <div>
                                            <Header>
                                                {item.product.brand}
                                            </Header>
                                            <Description>
                                                {removeTags(item.product.description)}
                                            </Description>
                                            <Header>
                                                {getProductPrice(item.product.prices, this.props.currency)}
                                            </Header>
                                            <SizeWrapper>
                                                {item.product.attributes[0].items.map((size, index) => (
                                                    <SizeContainer
                                                        selected={item.chosenSizes.includes(size.id)}
                                                        key={index}
                                                    >
                                                        {size?.displayValue}
                                                    </SizeContainer>
                                                ))}
                                            </SizeWrapper>
                                        </div>
                                        <ImageWrapper>
                                            <ButtonWrapper>
                                                <CustomButton
                                                    onClick={() =>
                                                        this.props.increaseProductAmount(item?.product?.id, item.chosenSizes[0])
                                                    }
                                                >
                                                    +
                                                </CustomButton>
                                                <TextCenter>{quantity}</TextCenter>
                                                <CustomButton onClick={() => quantity > 1 &&
                                                    this.props.decreaseProductAmount(item.product.id, item.chosenSizes[0])}
                                                              disabled={quantity === 1}
                                                >
                                                    -
                                                </CustomButton>
                                            </ButtonWrapper>
                                            <StyledImage
                                                width="60px"
                                                height="60px"
                                                src={item.product.gallery[0]}
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
