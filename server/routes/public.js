import express from 'express';
import { complaints, timelines, categories, departments } from '../data/store.js';

const router = express.Router();

router.get('/track/:trackingId', (req, res) => {
  const complaint = complaints.find((c) => c.trackingId === req.params.trackingId);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found' });

  const category = categories.find((c) => c.id === complaint.categoryId);
  const department = departments.find((d) => d.id === complaint.departmentId);
  const timeline = timelines
    .filter((t) => t.complaintId === complaint.id)
    .map((t) => ({ id: t.id, type: t.type, message: t.message, newStatus: t.newStatus, createdAt: t.createdAt }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  res.json({
    trackingId: complaint.trackingId,
    title: complaint.title,
    status: complaint.status,
    priority: complaint.priority,
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    slaDeadline: complaint.slaDeadline,
    location: { address: complaint.location.address },
    category: category ? { name: category.name } : null,
    department: department ? { name: department.name, code: department.code } : null,
    timeline,
  });
});

router.get('/stats', (req, res) => {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'resolved' && c.updatedAt && c.createdAt
  );
  const avgDays =
    resolvedComplaints.length > 0
      ? (
          resolvedComplaints.reduce((sum, c) => {
            return sum + (new Date(c.updatedAt) - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
          }, 0) / resolvedComplaints.length
        ).toFixed(1)
      : '0.0';

  res.json({
    totalFiled: total,
    resolved,
    avgDays,
    satisfaction: '87%',
  });
});

export default router;
