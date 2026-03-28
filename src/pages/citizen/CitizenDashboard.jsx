import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, FilePlus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await complaintsAPI.getMyComplaints(user.id, { limit: 100 });
        const all = result.complaints;
        setRecentComplaints(all.slice(0, 5));
        setStats({
          total: all.length,
          pending: all.filter(c => c.status === 'pending').length,
          inProgress: all.filter(c => c.status === 'in-progress').length,
          resolved: all.filter(c => c.status === 'resolved').length,
        });
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h2 className="text-xl font-bold text-[#0C2340]">Welcome back, {user?.name}!</h2>
          <p className="text-sm text-gray-500 mt-0.5">{getTodayFormatted()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard icon={FileText} value={stats.total} label="Total Filed" color="blue" />
        <StatsCard icon={Clock} value={stats.pending} label="Pending" color="saffron" />
        <StatsCard icon={AlertCircle} value={stats.inProgress} label="In Progress" color="red" />
        <StatsCard icon={CheckCircle} value={stats.resolved} label="Resolved" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/citizen/file')}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-[#FF9933] bg-orange-50 hover:bg-orange-100 transition text-left w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FF9933] flex items-center justify-center flex-shrink-0">
            <FilePlus size={22} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[#0C2340] text-base">File New Complaint</div>
            <div className="text-sm text-gray-500 mt-0.5">Submit a grievance to the appropriate department</div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/citizen/track')}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition text-left w-full"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Search size={22} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[#0C2340] text-base">Track Complaint</div>
            <div className="text-sm text-gray-500 mt-0.5">Check status using your tracking ID</div>
          </div>
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#0C2340] text-base">Recent Complaints</h3>
          <button
            onClick={() => navigate('/citizen/complaints')}
            className="text-sm font-semibold text-[#FF9933] hover:underline"
          >
            View All →
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No complaints yet"
            description="File your first complaint to get started."
            actionLabel="File a Complaint"
            onAction={() => navigate('/citizen/file')}
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {recentComplaints.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ backgroundColor: '#FAFAFA' }}
                onClick={() => navigate(`/citizen/complaints/${c.id}`)}
                className="px-5 py-4 cursor-pointer transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {c.trackingId}
                      </span>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm truncate">{c.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatDate(c.createdAt)}</div>
                  </div>
                  <div className="flex-shrink-0 pt-0.5">
                    {c.status !== 'resolved' && c.status !== 'rejected' && (
                      <SLACountdown deadline={c.slaDeadline} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
