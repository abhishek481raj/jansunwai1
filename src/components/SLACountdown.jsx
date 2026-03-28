import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

function getRemaining(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end - now;
  return diffMs;
}

function formatDuration(ms) {
  if (ms <= 0) return null;
  const totalHours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function SLACountdown({ deadline }) {
  const [remaining, setRemaining] = useState(getRemaining(deadline));

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining(deadline)), 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (remaining <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
        <AlertTriangle size={12} />
        OVERDUE
      </span>
    );
  }

  const hours = remaining / (1000 * 60 * 60);
  let colorClass = 'bg-green-50 border-green-200 text-green-700';
  if (hours < 12) colorClass = 'bg-red-50 border-red-200 text-red-700';
  else if (hours < 48) colorClass = 'bg-orange-50 border-orange-200 text-orange-700';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${colorClass}`}>
      <Clock size={12} />
      {formatDuration(remaining)}
    </span>
  );
}
