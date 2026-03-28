import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, X, UserCheck, ChevronDown, Loader2, MapPin, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { adminAPI } from '../../services/api';

const ITEMS_PER_PAGE = 10;
const STATUS_LABELS = {
  pending: 'Pending',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AssignDropdown({ complaint, officers, onAssigned }) {
  const [open, setOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const deptOfficers = officers.filter((o) => o.departmentId === complaint.departmentId);

  const handleAssign = async (officerId) => {
    setAssigning(true);
    try {
      await adminAPI.assignOfficer(complaint.id, officerId, 'admin');
      toast.success('Officer assigned successfully');
      setOpen(false);
      onAssigned();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to assign officer');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={assigning}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition hover:shadow-md disabled:opacity-60"
        style={{ background: 'linear-gradient(to right, #138808, #0f6b06)' }}
      >
        {assigning ? <Loader2 size={11} className="animate-spin" /> : <UserCheck size={11} />}
        Assign
        <ChevronDown size={11} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
            {deptOfficers.length === 0 ? (
              <div className="px-3 py-3 text-xs text-gray-500">No officers in this department</div>
            ) : (
              deptOfficers.map((officer) => (
                <button
                  key={officer.id}
                  onClick={() => handleAssign(officer.id)}
                  className="w-full text-left px-3 py-2.5 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF9933] transition flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
                  >
                    {officer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  {officer.name}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded-lg">
            {complaint.trackingId}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0C2340] mb-2">{complaint.title}</h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{complaint.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Citizen</p>
              <p className="text-sm text-gray-700">{complaint.citizen?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Filed On</p>
              <p className="text-sm text-gray-700">{formatDate(complaint.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Department</p>
              <p className="text-sm text-gray-700">{complaint.department?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Assigned Officer</p>
              <p className="text-sm text-gray-700">{complaint.officer?.name || 'Unassigned'}</p>
            </div>
          </div>
          {complaint.location?.address && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Location</p>
              <p className="text-sm text-gray-700 mb-2">{complaint.location.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${complaint.location.lat},${complaint.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium transition"
              >
                <MapPin size={12} />
                Open Location
                <ExternalLink size={10} />
              </a>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">SLA Status</p>
            <SLACountdown deadline={complaint.slaDeadline} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchOfficers = useCallback(async () => {
    try {
      const data = await adminAPI.getOfficers();
      setOfficers(data);
    } catch {}
  }, []);

  const fetchComplaints = useCallback(async () => {
    try {
      const data = await adminAPI.getAllComplaints({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit: ITEMS_PER_PAGE,
      });
      setComplaints(data.complaints);
      setTotal(data.total);
      setError(null);
    } catch {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchComplaints(), fetchOfficers()]).finally(() => setLoading(false));
  }, [fetchComplaints, fetchOfficers]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const onAssigned = () => { fetchComplaints(); };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <p className="text-red-500 text-sm font-medium">{error}</p>
      <button onClick={() => { setLoading(true); fetchComplaints(); }} className="text-sm font-semibold text-[#FF9933] hover:underline">
        Retry
      </button>
    </div>
  );

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0C2340]">All Complaints</h2>
        <p className="text-sm text-gray-500 mt-0.5">View, filter, and manage all citizen complaints</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[180px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search ID or title..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition bg-white text-gray-700"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400 font-medium">{total} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Tracking ID', 'Title', 'Citizen', 'Department', 'Status', 'Priority', 'SLA', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <EmptyState icon={FileText} title="No complaints found" description="Try adjusting your search or filter." />
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-[#FF9933]">{complaint.trackingId}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-sm text-gray-800 font-medium truncate" title={complaint.title}>{complaint.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        {complaint.citizen?.name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {complaint.department?.code || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={complaint.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <SLACountdown deadline={complaint.slaDeadline} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition whitespace-nowrap"
                        >
                          View
                        </button>
                        {!complaint.officerId && (
                          <AssignDropdown
                            complaint={complaint}
                            officers={officers}
                            onAssigned={onAssigned}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} of {total}
            </p>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {selectedComplaint && (
        <ComplaintDetailModal complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
      )}
    </div>
  );
}
