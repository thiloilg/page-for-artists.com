import { Handler } from '@netlify/functions';
import { verifyAccessToken } from './common/auth';

const mockData = {
  totalPageViews: 12547,
  uniqueVisitors: 3829,
  totalClicks: 4231,
  releases: [
    {
      id: '1',
      title: 'Summer Nights EP',
      totalClicks: 1823,
      storeClicks: [
        { store: 'Spotify', clicks: 892 },
        { store: 'Apple Music', clicks: 534 },
        { store: 'Amazon Music', clicks: 245 },
        { store: 'YouTube Music', clicks: 152 },
      ],
    },
    {
      id: '2',
      title: 'Midnight Dreams',
      totalClicks: 1456,
      storeClicks: [
        { store: 'Spotify', clicks: 678 },
        { store: 'Apple Music', clicks: 423 },
        { store: 'Amazon Music', clicks: 198 },
        { store: 'YouTube Music', clicks: 157 },
      ],
    },
    {
      id: '3',
      title: 'Urban Echoes',
      totalClicks: 952,
      storeClicks: [
        { store: 'Spotify', clicks: 445 },
        { store: 'Apple Music', clicks: 289 },
        { store: 'Amazon Music', clicks: 134 },
        { store: 'YouTube Music', clicks: 84 },
      ],
    },
  ],
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  // Verify the access token
  const authHeader = event.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Missing or invalid authorization header' }),
    };
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }

  try {
    // In a real implementation, you would:
    // 1. Get the user's Spotify URI from the database
    // 2. Fetch real analytics data for their releases
    // 3. Process and aggregate the data based on the timeRange
    const { timeRange } = JSON.parse(event.body || '{}');

    // For now, we'll just return mock data
    // In a real implementation, you'd filter/adjust the data based on timeRange
    return {
      statusCode: 200,
      body: JSON.stringify(mockData),
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch analytics data' }),
    };
  }
};
