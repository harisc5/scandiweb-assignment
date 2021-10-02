import initialState from "../initialState";
import * as constants from './constants';
import { RATES } from "../../constants";

export default function reducer(state = initialState.shop, action = {}) {
    const {type, payload} = action;
    switch (type) {
        case constants.ADD_ALL_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: {
                    clothes: payload.products[0].products,
                    tech: payload.products[1].products,
                }
            }
        case constants.ADD_ITEM_TO_CART_SUCCESS:
            const itemsCopy = Object.assign([], state.cart.items);
            const indexOfItem = state.cart.items.findIndex(({item}) =>
              (item.product.id === payload.item.product.id && item.chosenSizes.includes(payload.item.chosenSizes[0])));
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
            const cartCopy = Object.assign([], state.cart.items);
            const productIndex = state.cart.items.findIndex(({item}) =>
                (item.product.id === payload.id && item.chosenSizes.includes(payload.size)));
            cartCopy[productIndex].quantity += 1;
            return {
                ...state,
                cart: {
                   items: cartCopy
                }
            }
        case constants.DECREASE_PRODUCT_AMOUNT_SUCCESS:
            let items = Object.assign([], state.cart.items);
            const index = state.cart.items.findIndex(({item}) =>
                (item.product.id === payload.id && item.chosenSizes.includes(payload.size)));
            items[index].quantity -= 1;
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
        default:
            return state;
    }
}
