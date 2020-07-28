import React from "react";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Auth } from "aws-amplify";
import { gql } from "apollo-boost";

const GQL_ENDPOINT =
  "https://khoz9u3frf.execute-api.us-west-2.amazonaws.com/stage/graphql";

const cache = new InMemoryCache();

const authLink = setContext(
  (request) =>
    new Promise((resolve, reject) => {
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

//export default client;

const callGraphQL = async () => {
  const query = gql`
    {
      loggedInUser {
        email
        homeLocation {
          description
        }
      }
    }
  `;
  const { data } = await client.query({ query });
  console.log(data);
  return data;
};

export { callGraphQL };
