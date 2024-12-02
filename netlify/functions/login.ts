import { Handler } from '@netlify/functions';
import { generateTokens } from './common/auth';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    // TODO: replace with strapi user validation against /api/customers

    if (email === 'demo@example.com' && password === 'demo123') {
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
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid credentials' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Internal server error: ${error.message}` }),
    };
  }
};
