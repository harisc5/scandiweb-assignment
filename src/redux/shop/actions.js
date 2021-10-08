import {
    addItemToCartSuccess,
    removeItemFromCartSuccess,
    getProductsByCategorySuccess,
    changeCurrencySuccess,
    increaseProductAmountSuccess,
    decreaseProductAmountSuccess,
    showCartOverlaySuccess,
    getCategoriesSuccess,
    getCurrenciesSuccess
} from './actionCreators';

export const addItemToCart = (item) => (dispatch) => {
    dispatch(addItemToCartSuccess(item));
};

export const removeItemFromCart = (item) => (dispatch) => {
    dispatch(removeItemFromCartSuccess(item));
};

export const getProductsByCategory = (products, category) => (dispatch) => {
    dispatch(getProductsByCategorySuccess(products, category));
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

export const getCategories = (categories) => (dispatch) => {
    dispatch(getCategoriesSuccess(categories));
};

export const getCurrencies = (currencies) => (dispatch) => {
    dispatch(getCurrenciesSuccess(currencies));
};

