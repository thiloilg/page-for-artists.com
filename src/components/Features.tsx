import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, BarChart3, Search } from 'lucide-react';
import type { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Automatic Updates',
    description: 'Never manually update your bio links again. New releases are automatically added to your landing page.',
    icon: RefreshCw
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track which releases get the most clicks and which stores perform best with detailed analytics.',
    icon: BarChart3
  },
  {
    title: 'SEO Optimized',
    description: 'Get discovered more easily with our SEO-optimized landing pages and proper deep linking.',
    icon: Search
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Your Music Career
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features that help you focus on what matters most - your music.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}