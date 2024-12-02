import { Handler } from '@netlify/functions';
import { verifyRefreshToken, generateTokens } from './common/auth';
import cookie from 'cookie';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const cookies = cookie.parse(event.headers.cookie || '');
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No refresh token provided' }),
      };
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid refresh token' }),
      };
    }

    const tokens = generateTokens({ email: payload.email });

    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken: tokens.accessToken }),
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
