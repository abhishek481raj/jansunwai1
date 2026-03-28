import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { complaints, timelines, users, categories, departments } from '../data/store.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const enrichComplaint = (c) => {
  const citizen = users.find((u) => u.id === c.citizenId);
  const officer = c.officerId ? users.find((u) => u.id === c.officerId) : null;
  const category = categories.find((cat) => cat.id === c.categoryId);
  const department = departments.find((d) => d.id === c.departmentId);
  const timeline = timelines
    .filter((t) => t.complaintId === c.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return {
    ...c,
    citizen: citizen ? { id: citizen.id, name: citizen.name, phone: citizen.phone } : null,
    officer: officer ? { id: officer.id, name: officer.name, phone: officer.phone } : null,
    category: category || null,
    department: department || null,
    timeline,
  };
};

router.get('/dashboard', verifyToken, requireRole('admin'), (req, res) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const inProgress = complaints.filter((c) => c.status === 'in-progress').length;
  const assigned = complaints.filter((c) => c.status === 'assigned').length;
  const rejected = complaints.filter((c) => c.status === 'rejected').length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'resolved' && c.updatedAt && c.createdAt
  );
  const avgDays =
    resolvedComplaints.length > 0
      ? resolvedComplaints.reduce((sum, c) => {
          const diff = (new Date(c.updatedAt) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
          return sum + diff;
        }, 0) / resolvedComplaints.length
      : 0;

  const departmentStats = departments.map((dept) => {
    const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
    return {
      departmentId: dept.id,
      name: dept.name,
      code: dept.code,
      total: deptComplaints.length,
      pending: deptComplaints.filter((c) => c.status === 'pending').length,
      inProgress: deptComplaints.filter((c) => c.status === 'in-progress').length,
      resolved: deptComplaints.filter((c) => c.status === 'resolved').length,
    };
  });

  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const month = d.toLocaleString('default', { month: 'short' });
    const monthComplaints = complaints.filter((c) => {
      const cd = new Date(c.createdAt);
      return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
    });
    return {
      month,
      filed: monthComplaints.length,
      resolved: monthComplaints.filter((c) => c.status === 'resolved').length,
    };
  });

  res.json({ total, resolved, pending, inProgress, assigned, rejected, avgDays: avgDays.toFixed(1), departmentStats, monthlyData });
});

router.get('/complaints', verifyToken, requireRole('admin'), (req, res) => {
  const { status, departmentId, priority, search, page = 1, limit = 10 } = req.query;
  let result = [...complaints];
  if (status) result = result.filter((c) => c.status === status);
  if (departmentId) result = result.filter((c) => c.departmentId === departmentId);
  if (priority) result = result.filter((c) => c.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) => c.title.toLowerCase().includes(q) || c.trackingId.toLowerCase().includes(q)
    );
  }
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = result.length;
  const paginated = result.slice((page - 1) * limit, page * limit);
  res.json({ complaints: paginated.map(enrichComplaint), total, page: Number(page), limit: Number(limit) });
});

router.put('/complaints/:id/assign', verifyToken, requireRole('admin'), (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const { officerId } = req.body;
  const officer = users.find((u) => u.id === officerId && u.role === 'officer');
  if (!officer) return res.status(400).json({ error: 'Invalid officer' });

  const oldStatus = complaint.status;
  const now = new Date().toISOString();
  complaint.officerId = officerId;
  complaint.status = 'assigned';
  complaint.updatedAt = now;

  timelines.push({
    id: uuidv4(),
    complaintId: complaint.id,
    type: 'assignment',
    message: `Complaint assigned to ${officer.name}`,
    oldStatus,
    newStatus: 'assigned',
    userId: req.user.id,
    createdAt: now,
  });

  res.json(enrichComplaint(complaint));
});

export default router;
