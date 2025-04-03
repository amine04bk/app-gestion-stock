
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./layouts/Admin";
import LoginPage from "./views/Users/LoginPage";
import store from "./store";
const root = ReactDOM.createRoot(document.getElementById("root"));

var token = null;
token = localStorage.getItem("accessToken");
root.render(
    <Provider store={store}>
      <BrowserRouter>
        {token === null ?
          <Switch>
            <Route
              path="/login"
              render={() => <LoginPage />}
              key={"1"}
            />
            <Redirect from="*" to="/login" />
          </Switch>
          :
          <Switch>
            <Route render={(props) => <AdminLayout {...props} />} />
          </Switch>}
      </BrowserRouter>
    </Provider>
);
