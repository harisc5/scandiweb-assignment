import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { gql } from "@apollo/client";
import { getCategories, changeCurrency, handleShowCartOverlay, getCurrencies } from "../redux/shop/actions";
import LogoIcon from '../assets/logo-icon.svg';
import CartIcon from '../assets/cart-icon.svg';
import history from "../routes/history";
import CartOverlay from "./CartOverlay";
import { ImageWrapper } from "../shared-components";
import client from "../apollo-client";
import { GET_CATEGORIES, GET_CURRENCIES } from "../queries";

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
  color: ${(props) => (props.active ? '#5ECE7B ' : 'black')};;
  padding: 2px;
  border-bottom: ${(props) => (props.active ? '1px solid #5ECE7B ' : '')};

  &:hover {
    cursor: pointer;
    color: #5ECE7B;
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
  position: absolute;
  top:10px;
  right: 0;
`;

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.getNumberOfItemsInCart = this.getNumberOfItemsInCart.bind(this);
        this.state = {
            active: '',
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

    componentDidMount = () => {
        (async () => {
            const categoriesResult = await client.query({
                    query: gql`${GET_CATEGORIES}`
                });
            const currenciesResult = await client.query({
                query: gql`${GET_CURRENCIES}`
            })
            this.props.getCategories(categoriesResult?.data?.categories);
            this.props.getCurrencies(currenciesResult?.data?.currencies);
            this.setState({
                active: categoriesResult?.data?.categories[0]?.name
            })
        })();
    }

    getNumberOfItemsInCart = () => {
        let amount = 0;
        this.props.cart.forEach(item => {
            amount += item.quantity;
        });

        return amount;
    }

    render() {
        return (
            <>
                <StyledNavigation>
                    <StyledCategoriesWrapper>
                        {this.props.categories?.map((category, index) => (
                            <StyledCategory
                                active={this.state.active === category?.name}
                                onClick={() => this.handleClick(category?.name)}
                                key={index}
                            >
                                {category?.name.toUpperCase()}
                            </StyledCategory>
                        ))}
                    </StyledCategoriesWrapper>
                    <div>
                        <img src={LogoIcon} alt="Shop icon"/>
                    </div>
                    <FlexContainer>
                        <StyledSelect onChange={(e) => this.handleCurrencyChange(e.target.value)}
                        >
                            {this.props.currencies?.map((currency, index) => (
                                <option value={currency} key={index}>{currency}</option>
                            ))}

                        </StyledSelect>
                        <ImageWrapper>
                            <img src={CartIcon} alt="Cart icon" onClick={() => this.props.handleShowCartOverlay()}/>
                        </ImageWrapper>
                        {!!this.props.cart.length &&
                            <StyledSpan>{this.getNumberOfItemsInCart()}</StyledSpan>
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
    categories: state.shop.categories,
    currencies: state.shop.currencies,
}), { changeCurrency, handleShowCartOverlay, getCategories, getCurrencies })(Navbar);

