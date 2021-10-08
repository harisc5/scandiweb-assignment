import * as constants from './constants';

export const addItemToCartSuccess = (item) => ({
    type: constants.ADD_ITEM_TO_CART_SUCCESS,
    payload: {
        item,
    },
});

export const removeItemFromCartSuccess = (item) => ({
    type: constants.REMOVE_ITEM_FROM_CART_SUCCESS,
    payload: {
        item,
    },
});

export const getProductsSuccess = (products) => ({
    type: constants.GET_PRODUCTS_SUCCESS,
    payload: {
        products
    }
})

export const changeCurrencySuccess = (currency) => ({
    type: constants.CHANGE_CURRENCY_SUCCESS,
    payload: {
        currency,
    },
});

export const increaseProductAmountSuccess = (id, size) => ({
    type: constants.INCREASE_PRODUCT_AMOUNT_SUCCESS,
    payload: {
        id,
        size,
    },
});

export const decreaseProductAmountSuccess = (id, size) => ({
    type: constants.DECREASE_PRODUCT_AMOUNT_SUCCESS,
    payload: {
        id,
        size,
    },
});

export const showCartOverlaySuccess = () => ({
    type: constants.SHOW_CART_OVERLAY_SUCCESS,
    payload: {},
});

export const getCategoriesSuccess = (categories) => ({
    type: constants.GET_CATEGORIES_SUCCESS,
    payload: {
        categories
    },
});
export const getCurrenciesSuccess = (currencies) => ({
    type: constants.GET_CURRENCIES_SUCCESS,
    payload: {
        currencies
    },
});
