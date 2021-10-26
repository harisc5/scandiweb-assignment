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
import UpArrow from '../assets/up-arrow.png';
import DownArrow from '../assets/down-arrow.png';

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
  font-style: normal;
  font-weight: ${(props) => (props.active ? '600' : '400')};;
  line-height: 19px;
  letter-spacing: 0;
  text-align: center;

  &:hover {
    cursor: pointer;
    color: #5ECE7B;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-right: ${(props) => props.marginright || 0};
  align-items: end;
`;

const StyledCartCounter = styled.div`
  height: 20px;
  width: 20px;
  background: #1D1F22;
  border-radius: 60px;
  color: #FFFF;
  position: absolute;
  top:10px;
  right: 88px;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0;
  text-align: center;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  justify-content: center;
`;

const DropDownContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 50px;
  text-align: right;
  padding-right: 20px;
  :hover {
    cursor: pointer;
  }
`;

const DropDownHeader = styled.div`
  color: black;
  background: #ffffff;
  font-size: 18px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-style: normal;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
`;

const DropDownListContainer = styled.div`
  position: absolute;
  top: 50px;
`;

const DropDownList = styled.ul`
  margin: 0;
  background: #ffffff;
  box-shadow: 0 4px 35px rgba(168, 172, 176, 0.19);
  color: black;
  width: 114px;
  min-height: 169px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 0;
`;

const ListItem = styled.li`
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0;
  text-align: right;
  list-style: none;
  padding: 10px 10px 0 10px;
`;

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.showFullCurrencyValues = this.showFullCurrencyValues.bind(this);
        this.state = {
            active: '',
            isOpen: false,
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
        this.setState((prevState) => ({
            ...prevState,
            isOpen: false
        }));
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
                        <img src={LogoIcon} alt="Shop icon" height="29.92px" width="31.18px"/>
                    </div>
                    <FlexContainer marginright="88px">
                        <DropDownContainer>
                            <DropDownHeader
                                onClick={() => this.setState((prevState) => ({
                                ...prevState,
                                isOpen: !prevState.isOpen,
                            }))}
                            >
                                <span>
                                    {getCurrencySign(this.props.currency)}
                                </span>
                                {this.state.isOpen ?
                                    <img alt="up-arrow" src={UpArrow} width="6px" height="3px"
                                         style={{alignSelf: 'center'}}/> :
                                    <img alt="up-arrow" src={DownArrow} width="6px" height="3px"
                                         style={{alignSelf: 'center'}}/>
                                }
                            </DropDownHeader>
                            {this.state.isOpen && (
                                <DropDownListContainer>
                                    <DropDownList>
                                        {this.props.currencies?.map((currency, index) => (
                                            <ListItem
                                                onClick={() => this.handleCurrencyChange(currency)}
                                                id={`option-${currency}`}
                                                value={currency}
                                                data-display={`${getCurrencySign(currency)}`}
                                                key={index}
                                            >
                                                {`${getCurrencySign(currency)} ${currency}`}
                                            </ListItem>
                                        ))}
                                    </DropDownList>
                                </DropDownListContainer>
                            )}
                        </DropDownContainer>
                        <ImageWrapper>
                            <img src={CartIcon} alt="Cart icon" onClick={() => this.props.handleShowCartOverlay()} width="20px" height="20px"/>
                        </ImageWrapper>
                        {!!this.props.cart.length &&
                            <StyledCartCounter>{getNumberOfItemsInCart(this.props.cart)}</StyledCartCounter>
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

