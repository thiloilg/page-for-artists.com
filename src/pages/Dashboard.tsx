import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-600">
                Welcome back, <span className="font-medium">{user?.email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Page Views</div>
                    <div className="text-2xl font-bold text-gray-900">1,234</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Click Rate</div>
                    <div className="text-2xl font-bold text-gray-900">5.2%</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-500">Conversions</div>
                    <div className="text-2xl font-bold text-gray-900">42</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-600">Page updated</span>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-600">New subscriber</span>
                    <span className="text-sm text-gray-500">5 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-600">Analytics report</span>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
