import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
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
async function updateStrapiCustomer(subscriptionId, customerData) {
  console.log(`Finding customer in Strapi with subscriptionId: ${subscriptionId}`);

  // Step 1: Find the customer
  const findResponse = await fetch(
      `${STRAPI_API_ORIGIN}/api/customers?filters[subscription_id][$eq]=${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
  );

  const findData = await findResponse.json();
  if (!findResponse.ok || findData.data.length === 0) {
    throw new Error('Customer not found in Strapi');
  }

  const customerId = findData.data[0].id;

  // Step 2: Update the customer
  console.log(`Updating customer in Strapi with ID: ${customerId}`);
  const updateResponse = await fetch(
      `${STRAPI_API_ORIGIN}/api/customers/${customerId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: customerData }),
      }
  );

  if (!updateResponse.ok) {
    const error = await updateResponse.json();
    console.error('Failed to update Strapi customer:', error);
    throw new Error('Error updating customer in Strapi');
  }

  console.log('Customer updated successfully in Strapi.');
  return updateResponse.json();
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { subscription_id } = event.queryStringParameters;

    if (!subscription_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Subscription ID is required' }),
      };
    }

    const accessToken = await getAccessToken();

    console.log(`Fetching subscription details from PayPal for ID: ${subscription_id}...`);
    const response = await fetch(
        `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscription_id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    const subscriptionDetails = await response.json();

    if (!response.ok) {
      console.error('Failed to fetch PayPal subscription details:', subscriptionDetails);
      throw new Error(subscriptionDetails.message || 'Failed to fetch subscription details');
    }

    const { subscriber, status, create_time } = subscriptionDetails;

    const customerData = {
      paypal_email: subscriber.email_address,
      payment_status: status,
      paypal_start_time: create_time,
      first_name: subscriber.name.given_name,
      last_name: subscriber.name.surname,
    };

    console.log('Updating customer in Strapi...');
    await updateStrapiCustomer(subscription_id, customerData);

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
