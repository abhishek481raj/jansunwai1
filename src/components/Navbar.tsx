import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useTheme } from '../context/ThemeContext';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const navLinks = [
  { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { label: 'About', onClick: () => scrollTo('about') },
  { label: 'Departments', onClick: () => scrollTo('departments') },
  { label: 'Track Complaint', onClick: null },
  { label: 'Statistics', onClick: () => scrollTo('stats') },
  { label: 'Contact', onClick: () => scrollTo('footer') },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-[5px] z-40 bg-white dark:bg-gray-900 transition-all duration-300 ${scrolled ? 'shadow-lg dark:shadow-gray-900/50' : ''}`}
      style={{ top: '5px' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="JanSunwai home">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Emblem of India"
            className="h-12 w-auto"
          />
          <div className="h-10 w-px bg-gray-300 dark:bg-gray-600" />
          <div>
            <h1 className="text-xl font-extrabold text-[#0C2340] dark:text-white tracking-tight leading-tight">JanSunwai</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider">जनसुनवाई | National Grievance Portal</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Site navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.label === 'Track Complaint' ? () => navigate('/track') : (link.onClick || undefined)}
              className="relative group cursor-pointer bg-transparent border-none p-0"
              aria-label={link.label}
            >
              <span
                className={`text-sm font-semibold transition ${
                  link.label === 'Home' ? 'text-[#FF9933]' : 'text-gray-600 dark:text-gray-300 hover:text-[#FF9933]'
                }`}
              >
                {link.label}
              </span>
              {link.label === 'Home' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
              )}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSelector />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={dark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <Link
            to="/login"
            className="border-2 border-[#0C2340] dark:border-gray-400 text-[#0C2340] dark:text-gray-300 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#0C2340] hover:text-white dark:hover:bg-gray-700 dark:hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition"
            style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
          >
            Register
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={() => setMobileOpen(true)}
          aria-label="Open mobile menu"
        >
          <Menu size={24} className="text-[#0C2340] dark:text-white" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col p-6"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-[#0C2340] dark:text-white">Menu</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
                    aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {dark ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Close menu"
                  >
                    <X size={22} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <nav className="flex flex-col gap-4 flex-1" aria-label="Mobile navigation links">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.label === 'Track Complaint') { navigate('/track'); }
                      else if (link.onClick) { link.onClick(); }
                      setMobileOpen(false);
                    }}
                    className={`text-base font-semibold py-2 border-b border-gray-100 dark:border-gray-700 text-left cursor-pointer bg-transparent border-x-0 border-t-0 ${
                      link.label === 'Home' ? 'text-[#FF9933]' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full border-2 border-[#0C2340] dark:border-gray-500 text-[#0C2340] dark:text-gray-300 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0C2340] hover:text-white transition text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md text-center"
                  style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
