import React, { useEffect, useRef, useState } from 'react';
import { FileText, CheckCircle, Clock, ThumbsUp, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCard {
  stripe: string;
  iconBg: string;
  Icon: React.ElementType;
  value: number;
  suffix?: string;
  extraLabel?: string;
  label: string;
  trend: string;
  trendIcon: 'up' | 'down';
  isDecimal?: boolean;
  isPercent?: boolean;
}

const stats: StatCard[] = [
  {
    stripe: '#FF9933',
    iconBg: 'rgba(255,153,51,0.12)',
    Icon: FileText,
    value: 15847,
    label: 'Total Complaints Filed',
    trend: '↑ 12% this month',
    trendIcon: 'up',
  },
  {
    stripe: '#138808',
    iconBg: 'rgba(19,136,8,0.1)',
    Icon: CheckCircle,
    value: 12456,
    label: 'Successfully Resolved',
    trend: '78.6% resolution rate',
    trendIcon: 'up',
  },
  {
    stripe: '#2563EB',
    iconBg: 'rgba(37,99,235,0.1)',
    Icon: Clock,
    value: 4.2,
    isDecimal: true,
    extraLabel: 'Days',
    label: 'Avg Resolution Time',
    trend: '↓ 0.8 days faster',
    trendIcon: 'down',
  },
  {
    stripe: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.1)',
    Icon: ThumbsUp,
    value: 94.2,
    isPercent: true,
    label: 'Citizen Satisfaction',
    trend: 'Based on 8,432 reviews',
    trendIcon: 'up',
  },
];

function useCountUp(target: number, duration = 2000, start = false, isDecimal = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration, isDecimal]);
  return count;
}

function StatCardItem({ card, inView }: { card: StatCard; inView: boolean }) {
  const count = useCountUp(card.value, 2000, inView, card.isDecimal);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2"
      style={{
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
      }}
    >
      <div className="h-1 w-full" style={{ background: card.stripe }} />
      <div className="p-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ background: card.iconBg }}
        >
          <card.Icon size={24} color={card.stripe} strokeWidth={2} />
        </div>
        <div className="flex items-end gap-1 mb-1">
          <span className="font-black tracking-tight text-[#1E293B]" style={{ fontSize: '48px', lineHeight: 1 }}>
            {card.isPercent ? count.toFixed(1) : count.toLocaleString()}
          </span>
          {card.isPercent && <span className="text-3xl font-black text-[#1E293B] mb-0.5">%</span>}
          {card.extraLabel && (
            <span className="text-lg font-bold text-gray-400 mb-1.5 ml-1">{card.extraLabel}</span>
          )}
        </div>
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{card.label}</div>
        <div className="flex items-center gap-1.5">
          {card.trendIcon === 'up' ? (
            <TrendingUp size={14} color="#138808" />
          ) : (
            <TrendingDown size={14} color="#138808" />
          )}
          <span className="text-xs font-semibold text-[#138808]">{card.trend}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={ref}
      className="py-24"
      style={{ background: 'linear-gradient(to bottom, #ffffff, #F0F4F8)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(255,153,51,0.1)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.25)' }}
            >
              📊 Live Statistics
            </span>
            <h2 className="font-extrabold text-[#0C2340] mb-2" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              Making a Difference,{' '}
              <span style={{ color: '#FF9933' }}>One Complaint at a Time</span>
            </h2>
            <p className="text-gray-500 text-lg mt-3">Real-time data from across the nation</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((card, i) => (
            <StatCardItem key={i} card={card} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
