import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Building2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

const PRIORITY_BORDER = {
  low: 'border-l-gray-400',
  medium: 'border-l-blue-500',
  high: 'border-l-orange-500',
  urgent: 'border-l-red-600',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const PAGE_LIMIT = 8;

export default function MyComplaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('');
  const [allComplaints, setAllComplaints] = useState([]);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const result = await complaintsAPI.getMyComplaints(user.id, { limit: 1000 });
      setAllComplaints(result.complaints);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    setPage(1);
  }, [search, activeStatus]);

  const filtered = allComplaints.filter(c => {
    const matchesStatus = !activeStatus || c.status === activeStatus;
    const q = search.toLowerCase();
    const matchesSearch = !search ||
      c.title.toLowerCase().includes(q) ||
      c.trackingId.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_LIMIT);
  const paginated = filtered.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#0C2340]">
          My Complaints
          <span className="ml-2 text-sm font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title or tracking ID..."
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeStatus === tab.value
                ? 'text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={activeStatus === tab.value ? { background: 'linear-gradient(to right, #FF9933, #E8870D)' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size={40} />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <EmptyState
            icon={FileText}
            title={search || activeStatus ? 'No complaints match your filter' : 'No complaints yet'}
            description={search || activeStatus ? 'Try adjusting your search or filter.' : 'File your first complaint to get started.'}
            actionLabel={!search && !activeStatus ? 'File a Complaint' : undefined}
            onAction={!search && !activeStatus ? () => navigate('/citizen/file') : undefined}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/citizen/complaints/${c.id}`)}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${PRIORITY_BORDER[c.priority] || 'border-l-gray-400'} cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {c.trackingId}
                    </span>
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                  {c.status !== 'resolved' && c.status !== 'rejected' && (
                    <div className="flex-shrink-0">
                      <SLACountdown deadline={c.slaDeadline} />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm mb-1 leading-snug">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{c.description}</p>

                <div className="flex items-center gap-3 flex-wrap">
                  {c.department && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-medium">
                      <Building2 size={11} />
                      {c.department.name}
                    </span>
                  )}
                  {c.category && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-medium">
                      <Tag size={11} />
                      {c.category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                    <Calendar size={11} />
                    {formatDate(c.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
