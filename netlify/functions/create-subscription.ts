import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PLAN_ID = process.env.PAYPAL_PLAN_ID;
const STRAPI_API_ORIGIN = process.env.STRAPI_API_ORIGIN;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
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
    throw new Error('Error fetching access token');
  }
  return data.access_token;
}

async function saveStrapiCustomer(customerData) {
  const response = await fetch(`${STRAPI_API_ORIGIN}/api/customers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: customerData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error('Error saving customer to Strapi');
  }

  return response.json();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { spotifyUri, email } = JSON.parse(event.body || '{}');
    if (!spotifyUri || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Spotify URI and email are required' }),
      };
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: PLAN_ID,
        subscriber: { email_address: email },
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
      throw new Error(subscription.message || 'Failed to create subscription');
    }

    // Save initial customer data in Strapi
    const customerData = {
      email,
      spotify_url: spotifyUri,
      subscription_id: subscription.id,
      payment_status: subscription.status,
    };
    await saveStrapiCustomer(customerData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        approvalUrl: subscription.links.find((link) => link.rel === 'approve').href,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create subscription' }),
    };
  }
};
