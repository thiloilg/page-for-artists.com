import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollToDemo } from '../utils/scroll';

export function Hero() {
  return (
    <div className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />

      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 font-medium">
                Professional Artist Page for Just 1€/Month
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Music Career Deserves a
              <span className="text-indigo-600">
                {' '}
                Professional Landing Page
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Stop manually updating your bio links. Our platform automatically
              syncs with Spotify, Apple Music, and other major platforms to
              showcase your latest releases. Gain valuable insights and grow
              your audience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-12">
              <div className="flex flex-col items-center">
                <Link
                  to="/checkout"
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Buy for 1€
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-col items-center">
                <button
                  onClick={scrollToDemo}
                  className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  View Demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
