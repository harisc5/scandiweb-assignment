import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { changeCurrency, handleShowCartOverlay } from "../redux/shop/actions";
import ShopIcon from '../assets/shop-icon.png';
import CartIcon from '../assets/cart-icon.png';
import history from "../routes/history";
import CartOverlay from "./CartOverlay";
import { ImageWrapper } from "../shared-components";

const StyledNavigation = styled.nav`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const StyledCategoriesWrapper = styled.div`
  margin: 15px;
`

const StyledCategory = styled.span`
  margin: 5px;
  font-size: 16px;
  color: ${(props) => (props.active ? '#03fc28 ' : 'black')};;
  padding: 2px;
  border-bottom: ${(props) => (props.active ? '1px solid #03fc28 ' : '')};

  &:hover {
    cursor: pointer;
    color: #03fc28;
  }
`

const StyledSelect = styled.select`
  border: none;
  
  &:hover {
    cursor: pointer;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const StyledSpan = styled.span`
  border: 1px solid black;
  border-radius: 50%;
  height: 17px;
  background: black;
  color: white;
  padding: 1px 4px;
`;

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.state = {
            active: 'women',
        }
    }

    handleClick = (category) => {
        this.setState({
            active: category
        })
        history.push(`/${category}`)
    };

    handleCurrencyChange = (currency) => {
        this.props.changeCurrency(currency);
    }

    render() {
        return (
            <>
                <StyledNavigation>
                    <StyledCategoriesWrapper>
                        <StyledCategory active={this.state.active === 'women'}
                                        onClick={() => this.handleClick('women')}>
                            WOMEN
                        </StyledCategory>
                        <StyledCategory active={this.state.active === 'men'} onClick={() => this.handleClick('men')}>
                            MEN
                        </StyledCategory>
                        <StyledCategory active={this.state.active === 'kids'} onClick={() => this.handleClick('kids')}>
                            KIDS
                        </StyledCategory>
                    </StyledCategoriesWrapper>
                    <div>
                        <img src={ShopIcon} width="50px" height="50px" alt="Shop icon"/>
                    </div>
                    <FlexContainer>
                        <StyledSelect onChange={(e) => this.handleCurrencyChange(e.target.value)}
                        >
                            <option value="USD">$ USD</option>
                            <option value="GBP">£ GBP</option>
                            <option value="JPY">¥ JPY</option>
                        </StyledSelect>
                        <ImageWrapper>
                            <img src={CartIcon} width="50px" height="50px" alt="Cart icon" onClick={() => this.props.handleShowCartOverlay()}/>
                        </ImageWrapper>
                        {!!this.props.cart.length &&
                            <StyledSpan>{this.props.cart.length}</StyledSpan>
                        }
                    </FlexContainer>
                    </StyledNavigation>
                {this.props.showCartOverlay && <CartOverlay/>}
            </>
        );
    }

};

export default connect((state) => ({
    currency: state.shop.currency,
    cart: state.shop.cart.items,
    showCartOverlay: state.shop.showCartOverlay,
}), { changeCurrency, handleShowCartOverlay })(Navbar);

