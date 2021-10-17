import { Router, Route, Switch } from "react-router-dom";
import history from "./history";
import Shop from "../components/Shop";
import PDP from "../components/PDP";
import Cart from "../components/Cart";

export const Routes = () => (
    <Router history={history}>
        <Switch>
            <Route path="/product/:id" exact>
                <PDP/>
            </Route>
            <Route path="/cart" exact>
                <Cart/>
            </Route>
            <Route path="/:category" exact>
                <Shop/>
            </Route>
        </Switch>
    </Router>
)
