// import React from "react";
// // import ApolloClient from "apollo-boost";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { gql, ApolloLink } from "@apollo/client";
// import { setContext } from "apollo-link-context";
// import { ApolloProvider, useQuery } from "@apollo/react-hooks";
// import Status from "./components/Accounts/Status";
// import { Accounts, AccountContext } from "./components/Accounts";
// import { createHttpLink, HttpLink } from "apollo-link-http";
// import { GlobalProvider } from "./context/GlobalState";
// import "./App.css";
// import "antd/dist/antd.css";
// import { ApolloClient } from "@apollo/client";
// import { graphql } from "react-apollo";
// import Pool from "./components/Accounts/UserPool";
// const refreshToken = localStorage.getItem("refreshToken");

// const httpLink = createHttpLink({
//   // uri: "https://7xuah7382g.execute-api.us-east-1.amazonaws.com/dev/graphql",
//   uri: "https://khoz9u3frf.execute-api.us-west-2.amazonaws.com/stage/graphql",
//   credentials: "include",
//   fetchOptions: {
//     mode: "cors",
//   },
// });

// const GQL_ENDPOINT =
//   "https://khoz9u3frf.execute-api.us-west-2.amazonaws.com/stage/graphql";

// // const authLink = setContext((_, { headers }) => {
// //   const jwtToken = localStorage.getItem("jwtToken");
// //   return {
// //     headers: {
// //       Authorization: jwtToken ? `Bearer ${jwtToken}` : "",
// //       "content-type": "application/json",
// //       refreshToken: refreshToken || null,
// //       ...headers,
// //     },
// //   };
// // });
// const authLink = setContext(
//   (request) =>
//     new Promise((resolve, reject) => {
//       Pool.currentSession().then((session) => {
//         const token = session.idToken.jwtToken;
//         resolve({
//           headers: { Authorization: token },
//           session,
//         });
//       });
//     })
// );
// const client = new ApolloClient({
//   // link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
//   link: ApolloLink.from([authLink, new HttpLink({ uri: GQL_ENDPOINT })]),
// });

// // const callGraphQL = async () => {
// //   console.log("entry point");
// //   const query = gql`
// //     {
// //       loggedInUser {
// //         email
// //         homeLocation {
// //           description
// //         }
// //       }
// //     }
// //   `;
// //   console.log("goint to execute");
// //   console.log("client", client);
// //   const { data } = await client.query({ query });
// //   console.log(data);
// //   return data;
// // };

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <div className="App">
//         <GlobalProvider>
//           <Accounts>
//             <Status />
//           </Accounts>
//         </GlobalProvider>
//       </div>
//     </ApolloProvider>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import AppRoutes from "./routers/AppRoutes.jsx";
import { GlobalProvider } from "./context/GlobalState";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Auth } from "aws-amplify";
import { gql } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Amplify from "aws-amplify";
import AuthRoutes from "./routers/AuthRoutes";
const amplifyConfig = {
  region: process.env.REACT_APP_AWS_REGION || "us-west-2",
  Analytics: {
    // OPTIONAL - disable Analytics if true
    disabled: true,
  },
  Auth: {
    userPoolId: process.env.REACT_APP_USER_POOL_ID || "us-west-2_wtUQhInp3",
    userPoolWebClientId: process.env.REACT_APP_WEB_CLIENT_ID || "5fqur9aivpak9bo3k7bq5ol6pe",
  },
  // Auth: {
  //   UserPoolId: "us-east-1_flvAAhvx4",
  //   ClientId: "4idm3ro25b3cbe706r6ssr10l3",
  // },
};

Amplify.configure(amplifyConfig);
const GQL_ENDPOINT = process.env.REACT_APP_GQL_ENDPOINT || 
  "https://khoz9u3frf.execute-api.us-west-2.amazonaws.com/stage/graphql";

const cache = new InMemoryCache();

const authLink = setContext(
  () =>
    new Promise((resolve) => {
      Auth.currentSession().then((session) => {
        const token = session.idToken.jwtToken;
        resolve({
          headers: { Authorization: token },
        });
      });
    })
);

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    authLink,
    //stateLink, //near end but before HttpLink
    new HttpLink({ uri: GQL_ENDPOINT }),
  ]),
});

const callGraphQL = async () => {
  const query = gql`
    {
      loggedInUser {
        email
        homeLocation {
          description
          id
        }
      }
    }
  `;
  const { data } = await client.query({ query });
  return data;
};

function App({ props }) {
  // const [email, setEmail] = useState();
  const [signedIn, setSignedIn] = useState(false);
  const [homeLocationDescription, setHomeLocationDescription] = useState();

  useEffect(() => {
    async function doGraphQL() {
      const data = await callGraphQL();

      console.log(data);
      if (data) {
        localStorage.setItem("userId", data.loggedInUser.homeLocation.id);
        localStorage.setItem(
          "username",
          data.loggedInUser.homeLocation.description
        );
        // setEmail(data.loggedInUser.email);
        setHomeLocationDescription(data.loggedInUser.homeLocation.description);
        setSignedIn(true);
      }
    }
    doGraphQL();
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <GlobalProvider>
          {signedIn ? <AppRoutes /> : <AuthRoutes />}
        </GlobalProvider>
      </div>
    </ApolloProvider>
  );
}

export default App;
