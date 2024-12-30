import { useEffect, useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Music,
  Calendar,
  Store,
  Globe,
  ChevronDown,
} from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import type { LinkTrackingResponse, LinkTracking } from '../types';
import { formatDate, getLastNDays } from '../utils/date';

const COLORS = [
  '#4f46e5', // indigo-600
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface TimeRange {
  label: string;
  value: number;
}

const timeRanges: TimeRange[] = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
];

export function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkTrackings, setLinkTrackings] = useState<LinkTrackingResponse | null>(
    null
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    timeRanges[0]
  );
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

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

  const dailyClicksByDomain = useMemo(() => {
    if (!linkTrackings?.data) return [];

    const dates = getLastNDays(selectedTimeRange.value);
    const clicksByDate = dates.reduce((acc, date) => {
      acc[date] = {};
      return acc;
    }, {});

    // Get unique domains
    const domains = new Set(
      linkTrackings.data.map((tracking) => tracking.page.domain)
    );

    // Initialize all dates with 0 clicks for each domain
    dates.forEach((date) => {
      domains.forEach((domain) => {
        clicksByDate[date][domain] = 0;
      });
    });

    // Count clicks
    linkTrackings.data.forEach((tracking) => {
      const date = formatDate(new Date(tracking.datetime));
      if (clicksByDate[date]) {
        clicksByDate[date][tracking.page.domain] =
          (clicksByDate[date][tracking.page.domain] || 0) + 1;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(clicksByDate).map(([date, clicks]) => ({
      date,
      ...clicks,
    }));
  }, [linkTrackings, selectedTimeRange]);

  const platformStats = useMemo(() => {
    if (!linkTrackings?.data) return [];

    const platforms = linkTrackings.data.reduce((acc, tracking) => {
      const platform = tracking.link.platform;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(platforms).map(([name, value]) => ({
      name,
      value,
    }));
  }, [linkTrackings]);

  const domainStats = useMemo(() => {
    if (!linkTrackings?.data) return [];

    const domains = linkTrackings.data.reduce((acc, tracking) => {
      const domain = tracking.page.domain;
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(domains).map(([name, value]) => ({
      name,
      value,
    }));
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
  const uniquePages = new Set(
    linkTrackings?.data.map((tracking) => tracking.page.domain)
  ).size;
  const uniquePlatforms = new Set(
    linkTrackings?.data.map((tracking) => tracking.link.platform)
  ).size;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.email}
                </h1>
                <p className="text-gray-600">
                  Here's your detailed analytics overview
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{selectedTimeRange.label}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isTimeRangeOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {timeRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => {
                          setSelectedTimeRange(range);
                          setIsTimeRangeOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
                <h3 className="text-gray-500 text-sm">Active Pages</h3>
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniquePages.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Active Platforms</h3>
                <Store className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniquePlatforms.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Clicks Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Daily Clicks by Domain
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyClicksByDomain}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(dailyClicksByDomain[0] || {})
                      .filter((key) => key !== 'date')
                      .map((domain, index) => (
                        <Bar
                          key={domain}
                          dataKey={domain}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Clicks by Platform
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Domain Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Clicks by Domain
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={domainStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {domainStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Line */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Click Trends
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyClicksByDomain}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(dailyClicksByDomain[0] || {})
                      .filter((key) => key !== 'date')
                      .map((domain, index) => (
                        <Line
                          key={domain}
                          type="monotone"
                          dataKey={domain}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
