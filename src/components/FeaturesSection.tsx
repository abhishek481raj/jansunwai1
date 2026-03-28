import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, MapPin, Mic, Timer, Bell, BarChart3, ArrowRight } from 'lucide-react';

const features = [
  {
    gradientFrom: '#2563EB',
    gradientTo: '#1D4ED8',
    Icon: Globe,
    title: 'Multi-Language Support',
    desc: 'Available in Hindi, Telugu, and English. Breaking language barriers for inclusive governance.',
  },
  {
    gradientFrom: '#138808',
    gradientTo: '#15803D',
    Icon: MapPin,
    title: 'GPS Auto-Detection',
    desc: 'Automatically detects complaint location using GPS. Pinpoint accuracy for faster resolution.',
  },
  {
    gradientFrom: '#EF4444',
    gradientTo: '#FF9933',
    Icon: Mic,
    title: 'Voice Complaints',
    desc: 'Record audio complaints in your own language. Perfect for citizens who prefer speaking.',
  },
  {
    gradientFrom: '#7C3AED',
    gradientTo: '#6D28D9',
    Icon: Timer,
    title: 'SLA Monitoring',
    desc: 'Automatic 7-day deadline tracking. Escalation alerts ensure no complaint is forgotten.',
  },
  {
    gradientFrom: '#F59E0B',
    gradientTo: '#D97706',
    Icon: Bell,
    title: 'Real-time Notifications',
    desc: 'Instant SMS and app notifications on every status change. Stay informed always.',
  },
  {
    gradientFrom: '#0D9488',
    gradientTo: '#0F766E',
    Icon: BarChart3,
    title: 'Live Analytics Dashboard',
    desc: 'Public transparency dashboard with real-time statistics. Complete accountability.',
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,153,51,0.1)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.25)' }}
          >
            ✨ Key Features
          </span>
          <h2 className="font-extrabold mb-1" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            <span className="text-[#0C2340]">Why Choose </span>
            <span style={{ color: '#FF9933' }}>JanSunwai?</span>
          </h2>
          <p className="text-gray-500 text-lg mt-2">
            Built with cutting-edge technology for transparent governance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => navigate('/register')}
              className="bg-white border border-gray-100 rounded-2xl p-8 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(255,153,51,0.3)';
                el.style.boxShadow = '0 8px 30px rgba(255,153,51,0.1)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#f1f5f9';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${feat.gradientFrom}, ${feat.gradientTo})`,
                  boxShadow: `0 6px 18px ${feat.gradientFrom}40`,
                }}
              >
                <feat.Icon size={24} color="white" strokeWidth={1.8} />
              </div>

              <h3 className="text-lg font-bold text-[#0C2340] mt-5 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{feat.desc}</p>

              <div className="flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                <span className="text-sm font-semibold" style={{ color: feat.gradientFrom }}>
                  Learn more
                </span>
                <ArrowRight size={14} color={feat.gradientFrom} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
