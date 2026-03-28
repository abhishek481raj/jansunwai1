import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function CircularProgress({ percent }: { percent: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 -rotate-90" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="#FF9933"
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-black text-[#0C2340]">78.6%</div>
        <div className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">Resolution<br />Rate</div>
      </div>
    </div>
  );
}

export default function SearchCard() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate('/track?id=' + query.trim());
    else navigate('/track');
  };

  return (
    <div className="max-w-4xl mx-auto -mt-12 relative z-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-3xl p-8"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid #f1f5f9',
        }}
      >
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Search size={20} color="#FF9933" />
              <span className="text-xl font-bold text-[#0C2340]">Track Your Complaint</span>
            </div>
            <p className="text-sm text-gray-500">
              Enter your Grievance Tracking ID to check real-time status
            </p>
            <div className="mt-4 flex gap-0">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="GRV-2024-XXXXX"
                className="flex-1 h-14 text-lg rounded-l-xl px-5 outline-none transition-all"
                style={{
                  border: '2px solid #e2e8f0',
                  borderRight: 'none',
                  fontSize: '16px',
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#FF9933'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'; }}
                aria-label="Enter complaint tracking ID"
              />
              <button
                onClick={handleSearch}
                className="h-14 px-8 rounded-r-xl text-white font-bold text-base flex items-center gap-2 transition-all hover:opacity-90 cursor-pointer"
                style={{ background: '#FF9933', flexShrink: 0 }}
                aria-label="Search complaint"
              >
                <Search size={18} />
                Search
              </button>
            </div>
            <div className="mt-3">
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium text-[#FF9933] hover:text-[#E8870D] transition inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
              >
                Don't have an ID? File new complaint
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0">
            <CircularProgress percent={78.6} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
