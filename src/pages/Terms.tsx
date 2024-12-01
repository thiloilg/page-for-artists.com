import React from 'react';
import '../styles/legal.css';

export function Terms() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="legal-content">
          <h1>Terms of Service</h1>
          
          <h2>1. Service Description</h2>
          <p>Page for Artists provides automated landing pages for musicians and artists. The service automatically synchronizes with your Spotify profile to display your releases and related information.</p>

          <h2>2. Subscription</h2>
          <ul>
            <li>The service is provided on a subscription basis for 1€ per month</li>
            <li>Payment is processed through PayPal</li>
            <li>You can cancel your subscription at any time</li>
            <li>Refunds are handled according to PayPal's policies</li>
          </ul>

          <h2>3. User Obligations</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate Spotify artist information</li>
            <li>Maintain valid payment information</li>
            <li>Not misuse or attempt to manipulate the service</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2>4. Service Availability</h2>
          <p>We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the right to modify or discontinue features with reasonable notice.</p>

          <h2>5. Intellectual Property</h2>
          <p>Your content remains your property. You grant us necessary rights to display your content through our service.</p>

          <h2>6. Limitation of Liability</h2>
          <p>Our liability is limited to the amount paid for the service in the last month. We are not liable for indirect damages or lost profits.</p>

          <h2>7. Changes to Terms</h2>
          <p>We may update these terms with reasonable notice. Continued use of the service constitutes acceptance of new terms.</p>

          <h2>8. Termination</h2>
          <p>Either party may terminate the service. Upon termination, your landing page will be deactivated.</p>

          <h2>9. Governing Law</h2>
          <p>These terms are governed by German law. Disputes shall be resolved in Frankfurt am Main courts where applicable.</p>
        </div>
      </div>
    </div>
  );
}
