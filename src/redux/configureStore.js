import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import initialState from "./initialState";
import rootReducer from "./rootReducer";

export default function configureStore() {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunk)),
    );
}
