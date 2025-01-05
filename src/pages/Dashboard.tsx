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
  Clock,
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
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [isDomainSelectorOpen, setIsDomainSelectorOpen] = useState(false);

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
        // Set the first domain as default if none selected
        if (!selectedDomain && data.data.length > 0) {
          setSelectedDomain(data.data[0].page.domain);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkTrackings();
  }, [selectedDomain]);

  const domains = useMemo(() => {
    if (!linkTrackings?.data) return [];
    return Array.from(
      new Set(linkTrackings.data.map((tracking) => tracking.page.domain))
    );
  }, [linkTrackings]);

  const filteredData = useMemo(() => {
    if (!linkTrackings?.data || !selectedDomain) return [];
    return linkTrackings.data.filter(
      (tracking) => tracking.page.domain === selectedDomain
    );
  }, [linkTrackings, selectedDomain]);

  const dailyClicksByPlatform = useMemo(() => {
    if (!filteredData.length) return [];

    const dates = getLastNDays(selectedTimeRange.value);
    const clicksByDate = dates.reduce((acc, date) => {
      acc[date] = {};
      return acc;
    }, {});

    // Get unique platforms
    const platforms = new Set(
      filteredData.map((tracking) => tracking.link.platform)
    );

    // Initialize all dates with 0 clicks for each platform
    dates.forEach((date) => {
      platforms.forEach((platform) => {
        clicksByDate[date][platform] = 0;
      });
    });

    // Count clicks
    filteredData.forEach((tracking) => {
      const date = formatDate(new Date(tracking.datetime));
      if (clicksByDate[date]) {
        clicksByDate[date][tracking.link.platform] =
          (clicksByDate[date][tracking.link.platform] || 0) + 1;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(clicksByDate).map(([date, clicks]) => ({
      date,
      ...clicks,
    }));
  }, [filteredData, selectedTimeRange]);

  const clicksByHour = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      clicks: 0,
    }));

    filteredData.forEach((tracking) => {
      const hour = new Date(tracking.datetime).getHours();
      hours[hour].clicks++;
    });

    return hours;
  }, [filteredData]);

  const trackStats = useMemo(() => {
    const stats = {};
    filteredData.forEach((tracking) => {
      const trackKey = `${tracking.link.url}`; // You might want to extract track name from URL
      if (!stats[trackKey]) {
        stats[trackKey] = {
          url: tracking.link.url,
          platform: tracking.link.platform,
          clicks: 0,
        };
      }
      stats[trackKey].clicks++;
    });
    return Object.values(stats);
  }, [filteredData]);

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

  const totalClicks = filteredData.length;
  const uniquePlatforms = new Set(
    filteredData.map((tracking) => tracking.link.platform)
  ).size;
  const uniqueTracks = new Set(
    filteredData.map((tracking) => tracking.link.url)
  ).size;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.email}
                </h1>
                <p className="text-gray-600">
                  Here's your detailed analytics overview
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Domain Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsDomainSelectorOpen(!isDomainSelectorOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{selectedDomain || 'Select Domain'}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {isDomainSelectorOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => {
                            setSelectedDomain(domain);
                            setIsDomainSelectorOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  )}
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
                <h3 className="text-gray-500 text-sm">Active Platforms</h3>
                <Store className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniquePlatforms.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm">Unique Tracks</h3>
                <Music className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {uniqueTracks.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Clicks by Platform */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Daily Clicks by Platform
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyClicksByPlatform}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Object.keys(dailyClicksByPlatform[0] || {})
                      .filter((key) => key !== 'date')
                      .map((platform, index) => (
                        <Bar
                          key={platform}
                          dataKey={platform}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clicks by Hour */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Clicks by Hour of Day
              </h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clicksByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) =>
                        `${hour.toString().padStart(2, '0')}:00`
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(hour) =>
                        `${hour.toString().padStart(2, '0')}:00`
                      }
                    />
                    <Bar dataKey="clicks" fill={COLORS[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Track Performance Table */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Track Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 font-semibold text-gray-600">Track</th>
                      <th className="pb-3 font-semibold text-gray-600">
                        Platform
                      </th>
                      <th className="pb-3 font-semibold text-gray-600">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackStats.map((track, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            <Music className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{track.url}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{track.platform}</td>
                        <td className="py-3 text-gray-900">
                          {track.clicks.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 font-semibold text-gray-600">Time</th>
                      <th className="pb-3 font-semibold text-gray-600">Track</th>
                      <th className="pb-3 font-semibold text-gray-600">
                        Platform
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.datetime).getTime() -
                          new Date(a.datetime).getTime()
                      )
                      .slice(0, 10)
                      .map((click, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 last:border-0"
                        >
                          <td className="py-3">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">
                                {new Date(click.datetime).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-900">{click.link.url}</td>
                          <td className="py-3 text-gray-600">
                            {click.link.platform}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
