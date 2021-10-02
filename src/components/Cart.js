import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { decreaseProductAmount, handleShowCartOverlay, increaseProductAmount } from "../redux/shop/actions";
import { StyledOverlay, TextCenter } from "../shared-components";
import { getProductPrice, removeTags } from "../helpers";

const SizeContainer = styled.span`
  border: 1px solid black;
  font-size: 18px;
  margin: 5px;
  padding: 10px;
  color: ${(props) => (props.selected ? 'white ' : 'black')};;
  background-color: ${(props) => (props.selected ? 'black ' : 'white')};;
`;

const Header = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px;
`;

const BreakLine = styled.hr`
  border: 1px solid #E9E9E9;
  width: 100%;
  margin-top: 25px;
`;

const Description = styled.div`
  font-size: 18px;
  padding: 10px 20px;
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
  background-color: white;
  border: ${(props => props.borderunset ? 'unset': '')};
  
  &:hover{
    cursor: pointer;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SizeWrapper = styled.div`
  padding: 15px;
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
                        <Header>Cart</Header>
                        <div>
                            {this.props.cart.map(({ item, quantity }, index) => (
                                <Fragment key={index}>
                                    <BreakLine/>
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
                                                {item.product.attributes[0].items.map((size, sizeIndex) => (
                                                    <SizeContainer
                                                        key={sizeIndex}
                                                        selected={item.chosenSizes.includes(size.id)}
                                                    >
                                                        {size?.displayValue}
                                                    </SizeContainer>
                                                ))}
                                            </SizeWrapper>
                                        </div>
                                        <ImageWrapper>
                                            <ButtonWrapper>
                                                <CustomButton onClick={() => this.props.increaseProductAmount(item.product?.id, item.chosenSizes[0])}>+</CustomButton>
                                                <TextCenter>{quantity}</TextCenter>
                                                <CustomButton
                                                    onClick={() => quantity > 1 &&
                                                        this.props.decreaseProductAmount(item.product.id, item.chosenSizes[0])}
                                                    disabled={quantity === 1}
                                                >
                                                    -
                                                </CustomButton>
                                            </ButtonWrapper>
                                            <CustomButton
                                                onClick={() => this.updateCurrentProductImage(index, item.product.gallery.length, false)}
                                                borderunset
                                            >
                                                {`<`}
                                            </CustomButton>
                                            <img
                                                width="300px"
                                                height="300px"
                                                src={item.product.gallery[this.state.activeImages[index]]}
                                                alt="product"
                                            />
                                            <CustomButton
                                                onClick={() => this.updateCurrentProductImage(index, item.product.gallery.length)}
                                                borderunset
                                            >
                                                {`>`}
                                            </CustomButton>
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
