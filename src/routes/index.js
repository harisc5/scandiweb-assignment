import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./history";
import Shop from "../components/Shop";
import PDP from "../components/PDP";
import Cart from "../components/Cart";

export const Routes = () => (
    <Router history={history}>
        <Switch>
            <Route path="/women" exact>
                <Shop/>
            </Route>
            <Route path="/men" exact>
                <Shop/>
            </Route>
            <Route path="/kids" exact>
                <Shop/>
            </Route>
            <Route path="/product/:id" exact>
                <PDP/>
            </Route>
            <Route path="/cart" exact>
                <Cart/>
            </Route>
            <Route path="/*">
                <Redirect to={"/women"}/>
            </Route>
        </Switch>
    </Router>
)
