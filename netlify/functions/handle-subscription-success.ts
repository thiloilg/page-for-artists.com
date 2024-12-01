import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import crypto from 'crypto';

const PAYPAL_API_URL =
    process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const STRAPI_API_ORIGIN = process.env.STRAPI_API_ORIGIN;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

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

async function updateStrapiCustomer(customerData) {
  console.log('Updating customer in Strapi...');

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
    console.error('Failed to update Strapi customer:', error);
    throw new Error('Error updating Strapi customer');
  }

  console.log('Customer updated successfully in Strapi.');
  return response.json();
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
    const {subscription_id} = event.queryStringParameters;

    if (!subscription_id) {
      console.warn('Validation failed: Missing subscription_id');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Subscription ID is required',
        }),
      };
    }

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

    const {subscriber, status, create_time, id: payer_id} = subscriptionDetails;

    const customerData = {
      email: subscriber.email_address,
      password: crypto.randomBytes(8).toString('hex'), // Random 16-character password
      spotify_url: 'string', // Replace with the actual Spotify URL if available
      payment_status: status,
      paypal_start_time: create_time,
      paypal_payer_id: payer_id,
      first_name: subscriber.name.given_name,
      last_name: subscriber.name.surname,
    };

    console.log('Updating customer in Strapi...');
    await updateStrapiCustomer(customerData);

    return {
      statusCode: 302,
      headers: {
        Location: '/success',
      },
    };
  } catch (error) {
    console.error('Error occurred while processing subscription:', error);
    return {
      statusCode: 302,
      headers: {
        Location: '/error',
      },
    };
  }
};
