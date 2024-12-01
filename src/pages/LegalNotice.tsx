import React from 'react';
import '../styles/legal.css';

export function LegalNotice() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="legal-content">
          <h1>Legal Notice</h1>

          <h2>Information according to § 5 TMG</h2>
          <p>
            Thilo Ilg
            <br />
            Werrastraße 27-29
            <br />
            60486 Frankfurt am Main
            <br />
            Germany
          </p>

          <h2>Contact</h2>
          <p>Email: contact@thiloilg.com</p>

          <h2>Responsible for Content</h2>
          <p>Thilo Ilg</p>

          <h2>EU Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute
            resolution (OS):
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>

          <h2>Consumer Dispute Resolution</h2>
          <p>
            We are not willing or obliged to participate in dispute resolution
            proceedings before a consumer arbitration board.
          </p>

          <h2>Liability for Contents</h2>
          <p>
            As a service provider, we are responsible for our own content on
            these pages according to § 7 paragraph 1 TMG. According to §§ 8 to
            10 TMG, however, we are not obligated to monitor transmitted or
            stored third-party information or to investigate circumstances that
            indicate illegal activity.
          </p>
        </div>
      </div>
    </div>
  );
}
