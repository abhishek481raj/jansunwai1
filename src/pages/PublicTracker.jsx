import React, { useState, useEffect, useRef } from 'react';
import { Search, Shield, MapPin, Calendar, Building2, Tag, AlertTriangle, ArrowRight, Loader2, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import SLACountdown from '../components/SLACountdown';
import Timeline from '../components/Timeline';
import { publicAPI } from '../services/api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function ResultCard({ complaint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[#FF9933] bg-orange-50 px-3 py-1 rounded-lg tracking-wide">
            {complaint.trackingId}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <Calendar size={12} />
            Filed {formatDate(complaint.createdAt)}
          </span>
        </div>
        <SLACountdown deadline={complaint.slaDeadline} />
      </div>

      <div className="px-6 py-5 space-y-5">
        <div>
          <h3 className="text-base font-bold text-[#0C2340] mb-3 leading-snug">{complaint.title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="transform scale-110 origin-left">
              <StatusBadge status={complaint.status} />
            </div>
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {complaint.department && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Building2 size={13} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Department</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5">{complaint.department.name}</p>
              </div>
            </div>
          )}
          {complaint.category && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Tag size={13} className="text-[#FF9933]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5">{complaint.category.name}</p>
              </div>
            </div>
          )}
          {complaint.location?.address && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={13} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5 line-clamp-2">
                  {complaint.location.address.split(',').slice(0, 2).join(',')}
                </p>
              </div>
            </div>
          )}
        </div>

        {complaint.description && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{complaint.description}</p>
          </div>
        )}

        {complaint.timeline?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Activity Timeline</p>
            <Timeline entries={complaint.timeline} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NotFoundState({ trackingId, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-2">Complaint Not Found</h3>
      <p className="text-sm text-gray-500 mb-1">
        No complaint was found for tracking ID:
      </p>
      <p className="font-mono text-sm font-bold text-red-500 mb-5">{trackingId}</p>
      <p className="text-xs text-gray-400 mb-5">
        Please double-check your tracking ID. It should look like <span className="font-mono font-semibold">GRV-2024-XXXXX</span>.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-[#FF9933] border-2 border-[#FF9933] hover:bg-orange-50 transition"
      >
        Try Again
      </button>
    </motion.div>
  );
}

export default function PublicTracker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState('');
  const inputRef = useRef(null);

  const doSearch = async (id) => {
    const normalized = id.trim().toUpperCase();
    if (!normalized) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setSearched(normalized);
    try {
      const data = await publicAPI.track(normalized);
      setResult(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setInputValue(idParam.toUpperCase());
      doSearch(idParam);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setSearchParams(inputValue.trim() ? { id: inputValue.trim() } : {});
    doSearch(inputValue);
  };

  const handleReset = () => {
    setResult(null);
    setNotFound(false);
    setSearched('');
    setInputValue('');
    setSearchParams({});
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #0C2340, #1a3a5c)' }}
            >
              <Search size={28} color="white" strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C2340] mb-3">
              Track Your Complaint
            </h1>
            <p className="text-gray-500 text-base">
              Enter your tracking ID to check the real-time status of your grievance
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                  placeholder="GRV-2024-XXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition font-mono tracking-wider pr-10"
                  autoComplete="off"
                  spellCheck={false}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="px-5 py-3 rounded-xl text-white font-semibold text-sm flex items-center gap-2 transition hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>

            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-400">
                Your tracking ID was sent via SMS when you filed the complaint.
              </p>
              <Link
                to="/register"
                className="text-xs text-[#FF9933] font-semibold hover:underline flex items-center gap-1 flex-shrink-0 ml-4"
              >
                File a complaint
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center gap-3"
              >
                <Loader2 size={32} className="animate-spin text-[#FF9933]" />
                <p className="text-sm text-gray-500 font-medium">Looking up your complaint...</p>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div key="result">
                <ResultCard complaint={result} />
              </motion.div>
            )}

            {!loading && notFound && (
              <motion.div key="notfound">
                <NotFoundState trackingId={searched} onReset={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !result && !notFound && (
            <div className="text-center py-8">
              <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                <span>Try: GRV-2024-00001</span>
                <span>·</span>
                <span>GRV-2024-00003</span>
                <span>·</span>
                <span>GRV-2024-00007</span>
              </div>
              <p className="text-xs text-gray-300 mt-2">Sample tracking IDs for demo</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
