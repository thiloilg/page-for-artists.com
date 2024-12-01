import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-medium">Automatic Updates for Every Release</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Music Career Deserves a
              <span className="text-indigo-600"> Professional Landing Page</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Stop manually updating your bio links. Our platform automatically syncs with Spotify
              to showcase all your releases, complete with store links and analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
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

          {/* Right side - Phone Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
              <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                <iframe
                  src="https://pinobluntslide.de/"
                  className="w-full h-full"
                  title="Demo Landing Page"
                  scrolling="no"
                  style={{
                    border: 'none',
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
