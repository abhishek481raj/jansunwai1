import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  navy: { border: '#0C2340', bg: '#0C2340', text: '#0C2340', light: '#EEF2F7' },
  saffron: { border: '#FF9933', bg: '#FF9933', text: '#E8870D', light: '#FFF7ED' },
  green: { border: '#138808', bg: '#138808', text: '#138808', light: '#F0FDF4' },
  red: { border: '#DC2626', bg: '#DC2626', text: '#DC2626', light: '#FEF2F2' },
  blue: { border: '#2563EB', bg: '#2563EB', text: '#2563EB', light: '#EFF6FF' },
};

export default function StatsCard({ icon: Icon, value, label, trend, color = 'navy', index = 0 }) {
  const c = COLOR_MAP[color] || COLOR_MAP.navy;
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 relative overflow-hidden transition-all duration-300 cursor-default"
      style={{ borderLeft: `4px solid ${c.border}` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: c.light }}
      >
        {Icon && <Icon size={22} style={{ color: c.text }} strokeWidth={2} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">{value}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(trend)}% this month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
