import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Checkout() {
  const [spotifyUri, setSpotifyUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here we would normally validate the Spotify URI and create a PayPal subscription
      // For now, we'll just simulate the process
      window.location.href = `https://www.paypal.com/subscriptions/business?uri=${encodeURIComponent(spotifyUri)}`;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h1>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Artist Landing Page</h2>
              <div className="text-right">
                <span className="text-2xl font-bold text-indigo-600">1€</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Automatic sync with music platforms</li>
              <li>✓ Custom landing page</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Cancel anytime</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="spotifyUri" className="block text-sm font-medium text-gray-700 mb-1">
                Spotify Artist URI
              </label>
              <input
                type="text"
                id="spotifyUri"
                name="spotifyUri"
                placeholder="spotify:artist:..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={spotifyUri}
                onChange={(e) => setSpotifyUri(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                You can find this in your Spotify Artist profile
              </p>
            </div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading || !spotifyUri}
                className="w-full flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Continue to PayPal'}
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Monthly subscription. Cancel anytime.
              </p>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
