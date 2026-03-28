import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
          >
            <Shield size={18} color="white" />
          </div>
          <span className="text-lg font-extrabold text-[#0C2340] dark:text-white">JanSunwai</span>
        </Link>
        <Link
          to="/"
          className="text-sm font-semibold text-[#0C2340] dark:text-gray-300 border-2 border-[#0C2340] dark:border-gray-500 px-4 py-1.5 rounded-lg hover:bg-[#0C2340] hover:text-white transition"
        >
          Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="relative inline-block mb-8">
              <div
                className="w-32 h-32 rounded-3xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #0C2340, #1a3a5c)' }}
              >
                <span className="text-white font-black text-5xl select-none">404</span>
              </div>
              <motion.div
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
              >
                <Search size={20} color="white" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h1 className="text-2xl font-extrabold text-[#0C2340] dark:text-white mb-3">
                Page Not Found
              </h1>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:shadow-lg hover:scale-105"
                  style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
                  aria-label="Go to homepage"
                >
                  <Home size={16} />
                  Go to Homepage
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 border-[#0C2340] dark:border-gray-500 text-[#0C2340] dark:text-gray-300 hover:bg-[#0C2340] hover:text-white dark:hover:bg-gray-700 transition"
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link to="/track" className="text-sm font-semibold text-[#FF9933] hover:underline transition">
                  Track a Complaint
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to="/login" className="text-sm font-semibold text-[#FF9933] hover:underline transition">
                  Login
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to="/register" className="text-sm font-semibold text-[#FF9933] hover:underline transition">
                  Register
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
