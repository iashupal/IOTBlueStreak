import React from "react";
import { Switch, Route } from "react-router-dom";
// import Loader from "../components/Loader";
// import Loadable from "react-loadable";
import ForgotPassword from "../components/Accounts/ForgotPassword";
import Login from "../components/Accounts/Login";
// const Login = Loadable({
//   loader: () => import("../components/Accounts/Login"),
//   loading: Loader,
// });

function AuthRouter() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/forgot-password" exact component={ForgotPassword} />
    </Switch>
  );
}

export default AuthRouter;
