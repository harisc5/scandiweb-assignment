import initialState from "../initialState";
import * as constants from './constants';
import { RATES } from "../../constants";

export default function reducer(state = initialState.shop, action = {}) {
    const {type, payload} = action;
    let attributeKeys = null;
    switch (type) {
        case constants.GET_PRODUCTS_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                products: {
                    [payload.category]: payload.products
                }
            }
        case constants.ADD_ITEM_TO_CART_SUCCESS:
            attributeKeys = Object.keys(payload?.item?.attributes);
            const itemsCopy = JSON.parse(JSON.stringify(state.cart.items));
            const indexOfItem = state.cart.items.findIndex(({item}) =>
            (item?.product?.id === payload?.item?.product?.id &&
                  attributeKeys?.every(key => item?.attributes[key] === payload?.item?.attributes[key])));
            if(indexOfItem > -1) {
                itemsCopy[indexOfItem].quantity += 1;

                return {
                    ...state,
                    cart: {
                        items: itemsCopy
                    }
                }
            }
            return {
                ...state,
                cart: {
                    items: [...state.cart.items, {
                        ...payload,
                        quantity: 1
                    }]
                }
            }
        case constants.CHANGE_CURRENCY_SUCCESS:
            return {
                ...state,
                currency: payload.currency,
                rate: RATES[payload.currency]
            }
        case constants.INCREASE_PRODUCT_AMOUNT_SUCCESS:
            attributeKeys = Object.keys(payload?.attributes);
            const cartCopy = Object.assign([], state.cart.items);
            const productIndex = state.cart.items.findIndex(({item}) =>
                (item?.product?.id === payload?.id &&
                    attributeKeys?.every(key => item?.attributes[key] === payload?.attributes[key])));
            cartCopy[productIndex].quantity += 1;
            return {
                ...state,
                cart: {
                   items: cartCopy
                }
            }
        case constants.DECREASE_PRODUCT_AMOUNT_SUCCESS:
            attributeKeys = Object.keys(payload?.attributes);
            let items = Object.assign([], state.cart.items);
            const index = state.cart.items.findIndex(({item}) =>
                (item?.product?.id === payload?.id &&
                    attributeKeys?.every(key => item?.attributes[key] === payload?.attributes[key])));
            if(items[index].quantity > 1) {
                items[index].quantity -= 1;
            } else {
                items.splice(index, 1);
            }
            return {
                ...state,
                cart: {
                    items,
                }
            }
        case constants.SHOW_CART_OVERLAY_SUCCESS:
            return {
                ...state,
                showCartOverlay: !state.showCartOverlay
            }
        case constants.GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: payload.categories
            }
        case constants.GET_CURRENCIES_SUCCESS:
            return {
                ...state,
                currencies: payload.currencies
            }
        default:
            return state;
    }
}
