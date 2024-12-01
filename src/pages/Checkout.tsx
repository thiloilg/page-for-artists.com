import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateSpotifyArtistUrl, getSpotifyArtistUri } from '../utils/spotify';
import { validateEmail } from '../utils/validation';

export function Checkout() {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Validate Spotify URL
  useEffect(() => {
    if (spotifyUrl) {
      const { isValid, artistId } = validateSpotifyArtistUrl(spotifyUrl);
      setIsValidUrl(isValid);
      setUrlError(isValid ? '' : 'Please enter a valid Spotify artist profile URL');
    } else {
      setIsValidUrl(false);
      setUrlError('');
    }
  }, [spotifyUrl]);

  // Validate Email
  useEffect(() => {
    if (email) {
      const isValid = validateEmail(email);
      setIsValidEmail(isValid);
      setEmailError(isValid ? '' : 'Please enter a valid email address');
    } else {
      setIsValidEmail(false);
      setEmailError('');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    const { isValid, artistId } = validateSpotifyArtistUrl(spotifyUrl);
    if (!isValid || !artistId) {
      setUrlError('Invalid Spotify artist URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/create-subscription', {
        method: 'POST',
        body: JSON.stringify({ 
          spotifyUri: getSpotifyArtistUri(artistId),
          email: email.toLowerCase().trim() // Normalize email
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  emailError && email ? 'border-red-500' : 'border-gray-300'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                We'll send your landing page details to this email
              </p>
              {emailError && email && (
                <p className="mt-1 text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Your Spotify Artist Profile URL
              </label>
              <input
                type="url"
                id="spotifyUrl"
                name="spotifyUrl"
                placeholder="https://open.spotify.com/artist/..."
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  urlError && spotifyUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
              />
              <p className="mt-1 text-sm text-gray-500">
                Copy your Spotify artist profile URL from your browser
              </p>
              {urlError && spotifyUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {urlError}
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isValidUrl || !isValidEmail}
              className="w-full flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Continue to PayPal'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
