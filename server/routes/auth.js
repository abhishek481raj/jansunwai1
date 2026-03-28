import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/store.js';

const router = express.Router();
const SECRET = 'jansunwai-secret-key-2024';

const safeUser = (u) => {
  const { password, ...rest } = u;
  return rest;
};

router.post('/register', async (req, res) => {
  try {
    console.log('Register body:', req.body);
    const { name, email, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }
    if (users.find((u) => u.phone === phone)) {
      return res.status(400).json({ message: 'Phone already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'u' + Date.now(),
      name,
      email: email || '',
      phone,
      password: hashedPassword,
      role: 'citizen',
      avatar: name.split(' ').map((n) => n[0]).join('').toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: safeUser(newUser) });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('Login body:', req.body);
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password required' });
    }
    const user = users.find((u) => u.phone === phone);
    if (!user) return res.status(401).json({ message: 'User not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    const user = users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(safeUser(user));
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
