// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'o584t8sm5k'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-q1cnabul.us.auth0.com',            // Auth0 domain
  clientId: 'q8GfXjYcwtJffqDH7vXPwEKc2Cj3AlgG',          // Auth0 client id
  callbackUrl: 'http://datnt133-capstone.us-east-1.elasticbeanstalk.com/callback'
}
