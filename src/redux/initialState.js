import Immutable from 'seamless-immutable';
import { RATES } from "../constants";

const initialState = Immutable({
    shop: {
        products: {
        },
        cart: {
            items: []
        },
        currency: "USD",
        rate: RATES["USD"],
        showCartOverlay: false,
        categories: [],
        currencies: []
    },
});

export default initialState;
