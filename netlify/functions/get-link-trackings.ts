import { Handler } from '@netlify/functions';
import { verifyAccessToken } from './common/auth';
import fetch from 'node-fetch';
import { STRAPI_API_ORIGIN, STRAPI_API_TOKEN } from './common/envvars';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Verify the access token
  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing or invalid authorization header' }),
    };
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }

  try {
    const response = await fetch(
      `${STRAPI_API_ORIGIN}/api/link-trackings?populate[link][fields][0]=url&populate[link][fields][1]=platform&populate[page][fields][0]=name&populate[page][fields][1]=domain`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch link trackings');
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching link trackings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch link trackings' }),
    };
  }
};
