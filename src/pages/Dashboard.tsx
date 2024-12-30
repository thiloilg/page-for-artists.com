import { useEffect, useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Music } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LinkTrackingResponse, LinkTracking } from '../types';

interface DailyClicks {
  date: string;
  [key: string]: number | string;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#ff0000',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];

export function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkTrackings, setLinkTrackings] = useState<LinkTrackingResponse | null>(
    null
  );

  useEffect(() => {
    const fetchLinkTrackings = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('/.netlify/functions/get-link-trackings', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch link trackings');
        }

        const data = await response.json();
        setLinkTrackings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkTrackings();
  }, []);

  const chartData = useMemo(() => {
    if (!linkTrackings?.data) return [];

    // Get unique domains
    const domains = new Set(
      linkTrackings.data.map((tracking) => tracking.page.domain)
    );

    // Create a map of dates with click counts per domain
    const clicksByDate = linkTrackings.data.reduce((acc, tracking) => {
      const date = new Date(tracking.datetime).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date };
        // Initialize all domains with 0
        domains.forEach((domain) => {
          acc[date][domain] = 0;
        });
      }
      acc[date][tracking.page.domain]++;
      return acc;
    }, {} as Record<string, DailyClicks>);

    // Convert to array and sort by date
    return Object.values(clicksByDate).sort((a, b) =>
      (a.date as string).localeCompare(b.date as string)
    );
  }, [linkTrackings]);

  const domains = useMemo(() => {
    if (!linkTrackings?.data) return [];
    return Array.from(
      new Set(linkTrackings.data.map((tracking) => tracking.page.domain))
    );
  }, [linkTrackings]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  const totalClicks = linkTrackings?.data.length || 0;
  const uniqueVisitors = new Set(
    linkTrackings?.data.map((tracking) => tracking.link.url)
  ).size;
  const uniquePages = new Set(
    linkTrackings?.data.map((tracking) => tracking.page.domain)
  ).size;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email}
            </h1>
            <p className="text-gray-600">Here's your link tracking overview</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Total Clicks</h3>
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalClicks.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Unique Links</h3>
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniqueVisitors.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Active Pages</h3>
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniquePages.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Clicks by Domain (Last 30 Days)
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {domains.map((domain, index) => (
                    <Bar
                      key={domain}
                      dataKey={domain}
                      fill={COLORS[index % COLORS.length]}
                      stackId="a"
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
