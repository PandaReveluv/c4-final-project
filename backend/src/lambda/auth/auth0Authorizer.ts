import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
var jwksClient = require('jwks-rsa');

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-q1cnabul.us.auth0.com/.well-known/jwks.json'

var client = jwksClient({
  jwksUri: jwksUrl
});
async function getKey(header, callback) {
  client.getSigningKey(header.pid, function(err, key) {
    if (err) {
      logger.error("Unexpected get JWT error")
      return undefined;
    }
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey)
  });
}

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  let result = jwt.payload
  logger.info("Plain JWT: " + jwt.payload)
  verify(token, getKey, function(err, decodedJwtPayload) {
    if (err) {
      logger.error(err.message)
      throw new Error('Invalid JWT token')
    }
    if (decodedJwtPayload['sub'] != result.sub
    || decodedJwtPayload['iss'] != result.iss
    || decodedJwtPayload['iat'] != result.iat
    || decodedJwtPayload['exp'] != result.exp
    ) {
      throw new Error('Incorrect JWT token')
    }
  });
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return result
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
