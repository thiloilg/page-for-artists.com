import React from 'react';
import '../styles/legal.css';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="legal-content">
          <h1>Privacy Policy</h1>

          <h2>1. Overview</h2>
          <p>
            This Privacy Policy explains how Page for Artists collects, uses,
            and protects your personal information when you use our service.
          </p>

          <h2>2. Data We Collect</h2>
          <ul>
            <li>Email address (for account creation and communication)</li>
            <li>
              Spotify Artist URI (to generate and update your landing page)
            </li>
            <li>Payment information (processed securely through PayPal)</li>
            <li>Usage statistics (page views, click-through rates)</li>
            <li>Analytics data (visitor behavior, traffic sources)</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To create and maintain your artist landing page</li>
            <li>To automatically update your release information</li>
            <li>
              To provide analytics and insights about your page performance
            </li>
            <li>To process your subscription payments</li>
            <li>To communicate important service updates</li>
          </ul>

          <h2>4. Data Processing Partners</h2>
          <p>We work with the following service providers:</p>
          <ul>
            <li>PayPal (payment processing)</li>
            <li>Spotify API (content synchronization)</li>
            <li>Analytics providers (for performance tracking)</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>

          <h2>6. Contact</h2>
          <p>
            For privacy-related concerns, please contact:
            <br />
            contact@thiloilg.com
          </p>
        </div>
      </div>
    </div>
  );
}
