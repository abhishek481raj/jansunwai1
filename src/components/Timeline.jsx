import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, User, AlertCircle, ArrowRight } from 'lucide-react';

const TYPE_STYLES = {
  status_change: { color: '#2563EB', bg: '#EFF6FF', Icon: ArrowRight },
  assignment: { color: '#D97706', bg: '#FFFBEB', Icon: User },
  resolved: { color: '#16A34A', bg: '#F0FDF4', Icon: CheckCircle },
  rejected: { color: '#DC2626', bg: '#FEF2F2', Icon: AlertCircle },
};

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Timeline({ entries = [] }) {
  if (!entries.length) return null;

  return (
    <div className="space-y-0">
      {entries.map((entry, idx) => {
        const style = TYPE_STYLES[entry.type] || TYPE_STYLES.status_change;
        const { Icon } = style;
        const isLast = idx === entries.length - 1;

        return (
          <motion.div
            key={entry.id || idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06, ease: 'easeOut' }}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                style={{ backgroundColor: style.bg, border: `2px solid ${style.color}` }}
              >
                <Icon size={14} style={{ color: style.color }} />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-600 my-1" />}
            </div>

            <div className={`pb-5 flex-1 min-w-0 ${isLast ? 'pb-0' : ''}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">{entry.message}</p>
              {entry.newStatus && (
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  → {entry.newStatus}
                </span>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatTime(entry.createdAt)}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
