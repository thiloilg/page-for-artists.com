import { STRAPI_API_ORIGIN, STRAPI_API_TOKEN } from './envvars';

export async function saveStrapiCustomer(customerData) {
  const response = await fetch(`${STRAPI_API_ORIGIN}/api/customers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: customerData }),
  });

  if (!response.ok) {
    const error: Error = await response.json();
    throw new Error(`Error saving customer to Strapi: ${error.message}`);
  }

  return response.json();
}

export async function updateStrapiCustomer(subscriptionId, customerData) {
  console.log(
    `Finding customer in Strapi with subscriptionId: ${subscriptionId}`
  );

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

  const documentId = findData.data[0].documentId;

  // Step 2: Update the customer
  console.log(`Updating customer in Strapi with Document-ID: ${documentId}`);
  const updateResponse = await fetch(
    `${STRAPI_API_ORIGIN}/api/customers/${documentId}`,
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
