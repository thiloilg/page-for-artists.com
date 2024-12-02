import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Music } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface StoreClick {
  store: string;
  clicks: number;
}

interface ReleaseAnalytics {
  id: string;
  title: string;
  totalClicks: number;
  storeClicks: StoreClick[];
}

interface DashboardData {
  totalPageViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  releases: ReleaseAnalytics[];
}

export function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeRange, setTimeRange] = useState('7d'); // '7d', '30d', '90d'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ timeRange }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your artist page
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-8">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Page Views</h3>
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalPageViews.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Unique Visitors</h3>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.uniqueVisitors.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Total Clicks</h3>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalClicks.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Active Releases</h3>
                <Music className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.releases.length}
              </p>
            </div>
          </div>

          {/* Releases Analytics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Release Performance
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data?.releases.map((release) => (
                <div key={release.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {release.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {release.totalClicks.toLocaleString()} total clicks
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {release.storeClicks.map((store) => (
                      <div
                        key={store.store}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {store.store}
                        </div>
                        <div className="text-lg font-semibold text-indigo-600">
                          {store.clicks.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
