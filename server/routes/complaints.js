import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { complaints, timelines, users, categories, departments } from '../data/store.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const generateTrackingId = () => {
  const num = String(complaints.length + 1).padStart(5, '0');
  return `GRV-2024-${num}`;
};

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

router.get('/', verifyToken, requireRole('citizen'), (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;
  let result = complaints.filter((c) => c.citizenId === req.user.id);
  if (status) result = result.filter((c) => c.status === status);
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

router.post('/', verifyToken, requireRole('citizen'), (req, res) => {
  const { title, description, categoryId, location } = req.body;
  if (!title || !description || !categoryId || !location) {
    return res.status(400).json({ error: 'title, description, categoryId, location are required' });
  }
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return res.status(400).json({ error: 'Invalid category' });

  const now = new Date().toISOString();
  const slaDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const id = uuidv4();
  const newComplaint = {
    id,
    trackingId: generateTrackingId(),
    title,
    description,
    categoryId,
    departmentId: category.departmentId,
    citizenId: req.user.id,
    officerId: null,
    status: 'pending',
    priority: req.body.priority || 'medium',
    location,
    createdAt: now,
    updatedAt: now,
    slaDeadline,
  };
  complaints.push(newComplaint);
  timelines.push({
    id: uuidv4(),
    complaintId: id,
    type: 'status_change',
    message: 'Complaint filed successfully',
    oldStatus: null,
    newStatus: 'pending',
    userId: req.user.id,
    createdAt: now,
  });
  res.status(201).json(enrichComplaint(newComplaint));
});

router.get('/:id', verifyToken, (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  if (req.user.role === 'citizen' && complaint.citizenId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  if (req.user.role === 'officer' && complaint.officerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  res.json(enrichComplaint(complaint));
});

router.post('/:id/comment', verifyToken, (req, res) => {
  const complaint = complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  const entry = {
    id: uuidv4(),
    complaintId: complaint.id,
    type: 'comment',
    message,
    oldStatus: null,
    newStatus: null,
    userId: req.user.id,
    createdAt: new Date().toISOString(),
  };
  timelines.push(entry);
  res.status(201).json(entry);
});

export default router;
