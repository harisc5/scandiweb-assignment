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
import { getCurrencySign, getNumberOfItemsInCart } from "../helpers";

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
  height: 20px;
  margin-right: 10px;
  
  &:hover {
    cursor: pointer;
  }

  :focus-visible {
    outline: none;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-right: ${(props) => props.marginright || 0};
`;

const StyledSpan = styled.span`
  border: 1px solid black;
  border-radius: 100%;
  height: 17px;
  background: black;
  color: white;
  padding: 1px 4px;
  position: absolute;
  top:10px;
  right: 20px;
`;

const CustomOption = styled.option`
  text-align: end;
`

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.showFullCurrencyValues = this.showFullCurrencyValues.bind(this);
        this.handleShowCurrencies = this.handleShowCurrencies.bind(this);
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

    handleCurrencyChange = (e) => {
        let options = e.target.options,
            option = e.target.selectedOptions[0],
            i;

        for (i = 0; i < options.length; ++i) {
            options[i].innerText = `${getCurrencySign(options[i].value)} ${options[i].value}`
        }

        option.innerText = option.getAttribute('data-display');
        this.props.changeCurrency(e.target.value);
    }

    handleShowCurrencies= (e) => {
        let options = e.target.options;

        for (let i = 0; i < options.length; ++i) {
            options[i].innerText = `${getCurrencySign(options[i].value)} ${options[i].value}`
        }
    }

    componentDidMount = () => {
        (async () => {
            try {
                const categoriesResult = await client.query({
                    query: gql`${GET_CATEGORIES}`
                });
                const currenciesResult = await client.query({
                    query: gql`${GET_CURRENCIES}`
                })
                this.props.getCategories(categoriesResult?.data?.categories);
                this.props.getCurrencies(currenciesResult?.data?.currencies);
                this.setState({
                    active: window.location.pathname.slice(1)
                })

                let option = document.getElementById(`option-${this.props.currency}`);
                option.innerText = option.getAttribute('data-display');
            } catch (e) {
                console.error(e);
            }
        })();
    }

    showFullCurrencyValues = () => {
        this.props?.currencies?.forEach(currency => {
            let option = document.getElementById(`option-${currency}`);
            option.innerText = `${getCurrencySign(currency)} ${currency}`;
        })

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
                    <FlexContainer marginright="20px">
                        <StyledSelect
                            onChange={(e) => this.handleCurrencyChange(e)}
                            onMouseDown={(e) => this.handleShowCurrencies(e)}
                        >
                            {this.props.currencies?.map((currency, index) => (
                                <CustomOption
                                    onClick={() => this.showFullCurrencyValues()}
                                    id={`option-${currency}`}
                                    value={currency}
                                    data-display={`${getCurrencySign(currency)}`}
                                    key={index}
                                >
                                    {`${getCurrencySign(currency)} ${currency}`}
                                </CustomOption>
                            ))}

                        </StyledSelect>
                        <ImageWrapper>
                            <img src={CartIcon} alt="Cart icon" onClick={() => this.props.handleShowCartOverlay()} width="20px" height="20px"/>
                        </ImageWrapper>
                        {!!this.props.cart.length &&
                            <StyledSpan>{getNumberOfItemsInCart(this.props.cart)}</StyledSpan>
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

