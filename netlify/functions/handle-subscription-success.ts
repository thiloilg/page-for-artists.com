import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { PAYPAL_API_URL } from './common/envvars';
import { updateStrapiCustomer } from './common/strapi';
import { getAccessToken } from './common/paypal';

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

    console.log(
      `Fetching subscription details from PayPal for ID: ${subscription_id}...`
    );
    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscription_id}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const subscriptionDetails = await response.json();

    if (!response.ok) {
      console.error(
        'Failed to fetch PayPal subscription details:',
        subscriptionDetails
      );
      throw new Error(
        subscriptionDetails.message || 'Failed to fetch subscription details'
      );
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
