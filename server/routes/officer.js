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

router.get('/dashboard', verifyToken, requireRole('officer'), (req, res) => {
  const assigned = complaints.filter((c) => c.officerId === req.user.id);
  res.json({
    total: assigned.length,
    pending: assigned.filter((c) => c.status === 'pending').length,
    assigned: assigned.filter((c) => c.status === 'assigned').length,
    inProgress: assigned.filter((c) => c.status === 'in-progress').length,
    resolved: assigned.filter((c) => c.status === 'resolved').length,
  });
});

router.get('/complaints', verifyToken, requireRole('officer'), (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  let result = complaints.filter((c) => c.officerId === req.user.id);
  if (status) result = result.filter((c) => c.status === status);
  result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const total = result.length;
  const paginated = result.slice((page - 1) * limit, page * limit);
  res.json({ complaints: paginated.map(enrichComplaint), total, page: Number(page), limit: Number(limit) });
});

router.put('/complaints/:id/status', verifyToken, requireRole('officer'), (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  if (complaint.officerId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const { status, message } = req.body;
  const validStatuses = ['assigned', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const oldStatus = complaint.status;
  const now = new Date().toISOString();
  complaint.status = status;
  complaint.updatedAt = now;

  timelines.push({
    id: uuidv4(),
    complaintId: complaint.id,
    type: 'status_change',
    message: message || `Status updated to ${status}`,
    oldStatus,
    newStatus: status,
    userId: req.user.id,
    createdAt: now,
  });

  res.json(enrichComplaint(complaint));
});

export default router;
