import React from "react";
import { Switch, Route } from "react-router-dom";
import Loader from "../components/Loader";
import Loadable from "react-loadable";

const MainLayout = Loadable({
  loader: () => import("../layout/MainLayout"),
  loading: Loader,
});

const ClientLayout = Loadable({
  loader: () => import("../layout/ClientLayout"),
  loading: Loader,
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" exact component={MainLayout} />
      <Route path="/tank-details/:id" component={ClientLayout} />
    </Switch>
  );
}

export default AppRoutes;
