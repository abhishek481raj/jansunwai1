import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Clock, CheckSquare, AlertCircle, ChevronDown, ChevronUp, Eye, CreditCard as Edit3, MapPin, User, Calendar, X, Check, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import Timeline from '../../components/Timeline';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { officerAPI } from '../../services/api';

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const DEPT_NAMES = { dept1: 'Public Works', dept2: 'Water Supply & Sanitation', dept3: 'Electricity & Power' };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ComplaintCard({ complaint, onStatusUpdated }) {
  const [expanded, setExpanded] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [status, setStatus] = useState('in-progress');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!comment.trim()) { toast.error('Comment is required'); return; }
    setSubmitting(true);
    try {
      await officerAPI.updateStatus(complaint.id, status, comment.trim(), user.id);
      toast.success('Status updated successfully');
      setShowUpdate(false);
      setComment('');
      onStatusUpdated();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = () => { setExpanded(!expanded); setShowUpdate(false); };
  const toggleUpdate = () => { setShowUpdate(!showUpdate); setExpanded(false); };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex flex-wrap items-start gap-3 justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded-lg">
                {complaint.trackingId}
              </span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <h3 className="text-sm font-bold text-[#0C2340] leading-snug">{complaint.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User size={12} />
                {complaint.citizen?.name || 'Unknown Citizen'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(complaint.createdAt)}
              </span>
              {complaint.location?.address && (
                <span className="flex items-center gap-1 truncate max-w-xs">
                  <MapPin size={12} />
                  {complaint.location.address.split(',').slice(0, 2).join(',')}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <SLACountdown deadline={complaint.slaDeadline} />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Eye size={13} />
            View
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
            <button
              onClick={toggleUpdate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition hover:shadow-md"
              style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
            >
              <Edit3 size={13} />
              Update Status
            </button>
          )}
          {complaint.location?.lat && complaint.location?.lng && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${complaint.location.lat},${complaint.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              <MapPin size={14} />
              Open Location
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
              </div>
              {complaint.department && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Department</p>
                  <p className="text-sm text-gray-700">{complaint.department.name}</p>
                </div>
              )}
              {complaint.category && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Category</p>
                  <p className="text-sm text-gray-700">{complaint.category.name}</p>
                </div>
              )}
              {complaint.location?.address && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Location</p>
                  <p className="text-sm text-gray-700 flex items-start gap-1.5">
                    <MapPin size={13} className="text-[#FF9933] mt-0.5 flex-shrink-0" />
                    {complaint.location.address}
                  </p>
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
        )}

        {showUpdate && (
          <motion.div
            key="update"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleUpdate} className="px-5 pb-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Update Status</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition bg-white"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Comment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the action taken or reason for status change..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:shadow-md disabled:opacity-60"
                    style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowUpdate(false); setComment(''); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentName = user?.departmentId ? (DEPT_NAMES[user.departmentId] || 'Department') : 'Department';

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [dashData, complaintsData] = await Promise.all([
        officerAPI.getDashboard(user.id),
        officerAPI.getAssigned(user.id, { limit: 50 }),
      ]);
      setStats(dashData);
      const sorted = [...complaintsData.complaints].sort(
        (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
      );
      setComplaints(sorted);
      setError(null);
    } catch {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <LoadingSpinner fullPage />;

  if (error) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <p className="text-red-500 text-sm font-medium">{error}</p>
      <button onClick={fetchData} className="text-sm font-semibold text-[#FF9933] hover:underline">
        Retry
      </button>
    </div>
  );

  const pendingAction = (stats?.pending || 0) + (stats?.assigned || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0C2340]">Officer Dashboard — {departmentName}</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}. Manage your assigned complaints below.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard icon={ClipboardList} value={String(stats?.total || 0)} label="Total Assigned" color="navy" index={0} />
        <StatsCard icon={AlertCircle} value={String(pendingAction)} label="Pending Action" color="saffron" index={1} />
        <StatsCard icon={Clock} value={String(stats?.inProgress || 0)} label="In Progress" color="blue" index={2} />
        <StatsCard icon={CheckSquare} value={String(stats?.resolved || 0)} label="Resolved by Me" color="green" index={3} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#0C2340]">Complaints Assigned to You</h3>
          <span className="text-xs text-gray-400 font-medium">
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} · sorted by priority
          </span>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
            <EmptyState icon={ClipboardList} title="No complaints assigned" description="New complaints assigned to you will appear here." />
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} onStatusUpdated={fetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
