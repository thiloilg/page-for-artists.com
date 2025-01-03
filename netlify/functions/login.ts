import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { generateTokens } from './common/auth';
import { STRAPI_API_ORIGIN, STRAPI_API_TOKEN } from './common/envvars';

export const handler: Handler = async (event) => {
  console.log('Received event:', event);

  if (event.httpMethod !== 'POST') {
    console.warn('Invalid HTTP method:', event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Parsing request body...');
    const { email, password } = JSON.parse(event.body || '{}');
    console.log('Parsed request body:', { email });

    if (!email || !password) {
      console.warn('Missing email or password in request');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    // Create a password verification endpoint in Strapi
    console.log('Verifying password via Strapi...');
    const passwordVerifyResponse = await fetch(
        `${STRAPI_API_ORIGIN}/api/customers/verify-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({ email, password }),
        }
    );

    if (!passwordVerifyResponse.ok) {
      console.warn('Password verification failed');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    console.log('Password verified successfully. Generating tokens...');
    // Generate tokens
    const tokens = generateTokens({ email });

    console.log('Tokens generated:', tokens);

    return {
      statusCode: 200,
      body: JSON.stringify(tokens),
      headers: {
        'Set-Cookie': `refreshToken=${
            tokens.refreshToken
        }; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${
            60 * 60 * 24 * 7
        }`,
      },
    };
  } catch (error) {
    console.error('Error occurred during processing:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error: ${error.message}` }),
    };
  }
};
