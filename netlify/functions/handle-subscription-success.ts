import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import crypto from 'crypto';

const PAYPAL_API_URL =
    process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const STRAPI_API_ORIGIN = process.env.STRAPI_API_ORIGIN;
const STRAPI_API_KEY = process.env.STRAPI_API_KEY;

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

async function createStrapiUser(username, email, password) {
  const response = await fetch(`${STRAPI_API_ORIGIN}/api/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to create Strapi user:', error);
    throw new Error('Error creating Strapi user');
  }

  return response.json();
}

function generatePassword() {
  return crypto.randomBytes(8).toString('hex'); // Generate a random 16-character password
}

async function sendEmail(email, username, password) {
  console.log(`Sending email to ${email} with username: ${username}`);
  // Implement your email sending logic here.
  // You can use services like SendGrid, Postmark, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Email sent successfully');
      resolve();
    }, 1);
  }, 1);
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

    const { subscriber } = subscriptionDetails;
    const email = subscriber.email_address;
    const username = subscriber.name.given_name + '_' + subscriber.name.surname;
    const password = generatePassword();

    console.log('Creating user in Strapi...');
    await createStrapiUser(username, email, password);

    console.log('Sending email to user...');
    await sendEmail(email, username, password);

    return {
      statusCode: 302,
      headers: {
        Location: '/success',
      },
      body: JSON.stringify(subscriptionDetails),
    };
  } catch (error) {
    console.error('Error occurred while processing subscription:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process subscription' }),
    };
  }
};
