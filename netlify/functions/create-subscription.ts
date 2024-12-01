import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const PAYPAL_API_URL =
    process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PLAN_ID = process.env.PAYPAL_PLAN_ID;

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

  if (event.httpMethod !== 'POST') {
    console.warn('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    console.log('Parsing event body...');
    const { spotifyUri, email } = JSON.parse(event.body || '{}');

    if (!spotifyUri || !email) {
      console.warn('Validation failed: Missing spotifyUri or email');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Spotify URI and email are required',
        }),
      };
    }

    console.log('Fetching access token...');
    const accessToken = await getAccessToken();

    console.log('Creating subscription with PayPal...');
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: PLAN_ID,
        subscriber: {
          email_address: email,
        },
        custom_id: spotifyUri,
        application_context: {
          brand_name: 'Artist Landing Page',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.URL}/.netlify/functions/handle-subscription-success`,
          cancel_url: `${process.env.URL}/checkout`,
        },
      }),
    });

    const subscription = await response.json();

    if (!response.ok) {
      console.error('Failed to create PayPal subscription:', subscription);
      throw new Error(subscription.message || 'Failed to create subscription');
    }

    console.log('PayPal subscription created successfully:', subscription);

    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        approvalUrl: subscription.links.find(
            (link: any) => link.rel === 'approve'
        ).href,
      }),
    };
  } catch (error) {
    console.error('Error occurred while processing subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create subscription' }),
    };
  }
};
