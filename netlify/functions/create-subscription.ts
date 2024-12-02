import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { PAYPAL_API_URL, PLAN_ID } from './common/envvars';
import { getAccessToken } from './common/paypal';
import { saveStrapiCustomer } from './common/strapi';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.log('Invalid HTTP method:', event.httpMethod);
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    console.log('Received event:', event);

    const { spotifyUri, email } = JSON.parse(event.body || '{}');
    if (!spotifyUri || !email) {
      console.log('Missing required parameters:', { spotifyUri, email });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Spotify URI and email are required' }),
      };
    }

    console.log('Getting PayPal access token...');
    const accessToken = await getAccessToken();
    console.log('PayPal access token obtained:', accessToken);

    console.log('Creating PayPal subscription...');
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
    console.log('PayPal subscription response:', subscription);

    if (!response.ok) {
      console.error('Failed to create subscription:', subscription.message);
      throw new Error(subscription.message || 'Failed to create subscription');
    }

    const customerData = {
      email,
      spotify_url: spotifyUri,
      subscription_id: subscription.id,
      payment_status: subscription.status,
    };

    console.log('Saving customer to Strapi:', customerData);
    await saveStrapiCustomer(customerData);
    console.log('Customer saved successfully');

    const approvalUrl = subscription.links.find(
        (link) => link.rel === 'approve'
    )?.href;

    console.log('Subscription created successfully:', {
      subscriptionId: subscription.id,
      approvalUrl,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        subscriptionId: subscription.id,
        approvalUrl,
      }),
    };
  } catch (error) {
    console.error('Error occurred:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to create subscription: ${error.message}`,
      }),
    };
  }
};
