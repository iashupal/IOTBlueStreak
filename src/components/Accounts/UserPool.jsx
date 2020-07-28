import { CognitoUserPool } from "amazon-cognito-identity-js";

/* Base URL for API calls */
// const gqlEndpoint = "https://7xuah7382g.execute-api.us-east-1.amazonaws.com/dev/graphql";

/* AWS Cognito Pool information for production */
// const poolData = {
//   UserPoolId: "us-east-1_flvAAhvx4",
//   ClientId: "4idm3ro25b3cbe706r6ssr10l3",
// };
const poolData = {
  UserPoolId: "us-west-2_wtUQhInp3",
  ClientId: "5fqur9aivpak9bo3k7bq5ol6pe",
};
export default new CognitoUserPool(poolData);
