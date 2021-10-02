import Immutable from 'seamless-immutable';
import { RATES } from "../constants";

const initialState = Immutable({
    shop: {
        products: {
            clothes: [],
            tech: []
        },
        cart: {
            items: []
        },
        currency: "USD",
        rate: RATES["USD"],
        showCartOverlay: false
    },
});

export default initialState;
