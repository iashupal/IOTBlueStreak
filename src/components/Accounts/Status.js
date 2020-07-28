import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./index";
import AppRoutes from "../../routers/AppRoutes";
import AuthRoutes from "../../routers/AuthRoutes";
// import callGraphQL from "../../App";
// import { callGraphQL } from "../../graphql-test";

export default () => {
  const [status, setStatus] = useState(false);
  const { getSession } = useContext(AccountContext);
  const [homeLocationDescription, setHomeLocationDescription] = useState();

  useEffect(() => {
    console.log();
    getSession().then((session) => {
      // localStorage.setItem("jwtToken", session.accessToken.jwtToken);
      // localStorage.setItem("clientId", session.accessToken.payload.client_id);
      // localStorage.setItem("refreshToken", session.refreshToken.token);
      console.log("session", session);
      setStatus(true);
      // doGraphQl();
    });
  }, [getSession]);
  return (
    <div>
      {/* <AuthRoutes /> */}
      {status ? <AppRoutes /> : <AuthRoutes />}
    </div>
  );
};
