import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const PAYPAL_API_URL =
    process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  console.log('Fetching PayPal access token...');

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Failed to fetch PayPal access token:', data);
    throw new Error('Error fetching access token');
  }

  console.log('Successfully fetched PayPal access token.');
  return data.access_token;
}

export const handler: Handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));

  if (event.httpMethod !== 'GET') {
    console.warn('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Parse URL parameters
    const { subscription_id } = event.queryStringParameters;

    if (!subscription_id) {
      console.warn('Validation failed: Missing subscription_id');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Subscription ID is required',
        }),
      };
    }

    console.log('Fetching access token...');
    const accessToken = await getAccessToken();

    console.log('Fetching subscription details from PayPal...');
    const response = await fetch(
        `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscription_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
    );

    const subscriptionDetails = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch PayPal subscription details:', subscriptionDetails);
      throw new Error(subscriptionDetails.message || 'Failed to fetch subscription details');
    }

    console.log('PayPal subscription details fetched successfully:', subscriptionDetails);

    return {
      statusCode: 302, // Redirect
      headers: {
        Location: '/success',
      },
      body: JSON.stringify(subscriptionDetails),
    };
  } catch (error) {
    console.error('Error occurred while fetching subscription details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch subscription details' }),
    };
  }
};
