import express from 'express';
import Event from '../models/Event.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to check JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Create Event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all events (optionally filter by user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.query.mine === 'true' ? { createdBy: req.user.id } : {};
    const events = await Event.find(filter);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single event
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update event
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete event
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

import path from 'path';
import fs from 'fs';
import upload from '../multerConfig.js';

// Upload document to event
router.post('/:id/documents', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const doc = {
      filename: req.file.filename,
      path: req.file.path,
      originalname: req.file.originalname,
      uploadDate: new Date()
    };
    event.documents.push(doc);
    await event.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List documents for event
router.get('/:id/documents', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event.documents || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve static files for download
router.get('/documents/download/:filename', authMiddleware, (req, res) => {
  const filePath = path.join(process.cwd(), 'backend', 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  res.download(filePath);
});

export default router;
