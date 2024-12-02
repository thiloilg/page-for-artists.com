import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';
import { generateTokens } from './common/auth';
import { STRAPI_API_ORIGIN, STRAPI_API_TOKEN } from './common/envvars';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    // Fetch customer by email from Strapi
    const response = await fetch(
        `${STRAPI_API_ORIGIN}/api/customers?filters[email][$eq]=${encodeURIComponent(email)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
        }
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error connecting to Strapi' }),
      };
    }

    const { data } = await response.json();

    if (!data || data.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    const customer = data[0];

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Generate tokens
    const tokens = generateTokens({ email });

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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error: ${error.message}` }),
    };
  }
};
