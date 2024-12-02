import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie':
        'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    },
    body: JSON.stringify({ message: 'Logged out successfully' }),
  };
};
