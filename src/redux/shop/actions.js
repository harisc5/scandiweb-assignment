import {
    addItemToCartSuccess,
    removeItemFromCartSuccess,
    addAllProductsSuccess,
    changeCurrencySuccess,
    increaseProductAmountSuccess,
    decreaseProductAmountSuccess,
    showCartOverlaySuccess
} from './actionCreators';

export const addItemToCart = (item) => (dispatch) => {
    dispatch(addItemToCartSuccess(item));
};

export const removeItemFromCart = (item) => (dispatch) => {
    dispatch(removeItemFromCartSuccess(item));
};

export const addAllProducts = (products) => (dispatch) => {
    dispatch(addAllProductsSuccess(products));
}

export const changeCurrency = (currency) => (dispatch) => {
    dispatch(changeCurrencySuccess(currency));
};

export const increaseProductAmount = (id, size) => (dispatch) => {
    dispatch(increaseProductAmountSuccess(id, size));
};

export const decreaseProductAmount = (id, size) => (dispatch) => {
    dispatch(decreaseProductAmountSuccess(id, size));
};

export const handleShowCartOverlay = () => (dispatch) => {
    dispatch(showCartOverlaySuccess());
};

