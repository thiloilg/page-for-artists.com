import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
      
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-medium">Automatic Updates for Every Release</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Music Career Deserves a
              <span className="text-indigo-600"> Professional Landing Page</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Stop manually updating your bio links. Our platform automatically syncs with Spotify
              to showcase all your releases, complete with store links and analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/signup"
                className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                to="/demo"
                className="flex items-center px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}