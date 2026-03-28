import express from 'express';
import cors from 'cors';
import { departments, categories, users } from './data/store.js';

import authRoutes from './routes/auth.js';
import complaintsRoutes from './routes/complaints.js';
import officerRoutes from './routes/officer.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.get('/api/categories', (req, res) => {
  const { departmentId } = req.query;
  const result = departmentId
    ? categories.filter((c) => c.departmentId === departmentId)
    : categories;
  res.json(result);
});

app.get('/api/test', (req, res) => {
  res.json({ status: 'Backend running', users: users.length });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('Users in database: ' + users.length);
});
