import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, AlertTriangle, Loader2,
  UserCheck, BarChart2, ChevronDown, User, Building2, X, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { adminAPI } from '../../services/api';

const ITEMS_PER_PAGE = 8;
const PIE_COLORS = ['#64748b', '#F59E0B', '#3B82F6', '#FF9933', '#16A34A', '#DC2626'];
const STATUS_LABELS = { pending: 'Pending', assigned: 'Assigned', 'in-progress': 'In Progress', resolved: 'Resolved', rejected: 'Rejected' };

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
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded-lg">
              {complaint.trackingId}
            </span>
          </div>
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
              <p className="text-sm text-gray-700">{complaint.location.address}</p>
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const [dashData, officersData] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getOfficers(),
      ]);
      setStats(dashData);
      setOfficers(officersData);
    } catch {
      setError('Failed to load dashboard stats');
    }
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
    } catch {
      setError('Failed to load complaints');
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchComplaints()]).finally(() => setLoading(false));
  }, [fetchStats, fetchComplaints]);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const onAssigned = () => { fetchStats(); fetchComplaints(); };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <p className="text-red-500 text-sm font-medium">{error}</p>
      <button onClick={() => { fetchStats(); fetchComplaints(); }} className="text-sm font-semibold text-[#FF9933] hover:underline">
        Retry
      </button>
    </div>
  );

  const overdue = complaints.filter((c) => new Date(c.slaDeadline) < new Date() && c.status !== 'resolved' && c.status !== 'rejected').length;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const pieData = stats
    ? [
        { name: 'Pending', value: stats.pending },
        { name: 'Assigned', value: stats.assigned },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Resolved', value: stats.resolved },
        { name: 'Rejected', value: stats.rejected },
      ].filter((d) => d.value > 0)
    : [];

  const barData = stats?.departmentStats?.map((d) => ({
    name: d.code,
    Pending: d.pending,
    'In Progress': d.inProgress,
    Resolved: d.resolved,
  })) || [];

  const areaData = stats?.monthlyData || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0C2340]">Admin Control Panel</h2>
        <p className="text-sm text-gray-500 mt-0.5">System-wide grievance overview and management</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard icon={FileText} value={String(stats?.total || 0)} label="Total Complaints" trend={5} color="navy" index={0} />
        <StatsCard icon={Clock} value={String(stats?.pending || 0)} label="Pending" color="saffron" index={1} />
        <StatsCard icon={UserCheck} value={String(stats?.assigned || 0)} label="Assigned" color="blue" index={2} />
        <StatsCard icon={BarChart2} value={String(stats?.inProgress || 0)} label="In Progress" color="blue" index={3} />
        <StatsCard icon={CheckCircle} value={String(stats?.resolved || 0)} label="Resolved" trend={8} color="green" index={4} />
        <StatsCard icon={AlertTriangle} value={String(overdue)} label="Overdue" color="red" index={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-[#0C2340] mb-4">Complaints by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Pending" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="In Progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Resolved" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-[#0C2340] mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11 }}
                formatter={(value, entry) => (
                  <span style={{ color: '#374151' }}>{value} ({entry.payload.value})</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#0C2340] mb-4">Monthly Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="filedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF9933" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="filed" name="Filed" stroke="#FF9933" strokeWidth={2} fill="url(#filedGrad)" dot={{ r: 3 }} />
            <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#16A34A" strokeWidth={2} fill="url(#resolvedGrad)" dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-bold text-[#0C2340] flex-1">All Complaints</h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-56">
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
          </div>
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
