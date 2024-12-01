import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link
            to="/legal"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Legal Notice
          </Link>
          <Link
            to="/privacy"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Terms of Service
          </Link>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Page for Artists. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
