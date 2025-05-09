import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import suppliersRoutes from './routes/suppliers.js';
import tasksRoutes from './routes/tasks.js';
import messagesRoutes from './routes/messages.js';
import usersRoutes from './routes/users.js';
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', usersRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Wecicada backend is running');
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wecicada', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
