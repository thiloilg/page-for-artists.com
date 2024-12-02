import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { PAYPAL_API_URL, PLAN_ID } from './common/envvars';
import { getAccessToken } from './common/paypal';
import { saveStrapiCustomer } from './common/strapi';

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
          return_url: `${URL}/.netlify/functions/handle-subscription-success`,
          cancel_url: `${URL}/checkout`,
        },
      }),
    });

    const subscription = await response.json();
    if (!response.ok) {
      throw new Error(subscription.message || 'Failed to create subscription');
    }

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
        approvalUrl: subscription.links.find((link) => link.rel === 'approve')
          .href,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to create subscription ${error.message}`,
      }),
    };
  }
};
