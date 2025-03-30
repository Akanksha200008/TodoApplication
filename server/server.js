const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');
const auth = require('./middleware/auth');
const User = require('./models/User');

dotenv.config();
const app = express();

// Middleware
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log request bodies
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body type:', typeof req.body);
    console.log('Request content-type:', req.headers['content-type']);
    console.log('Request body keys:', Object.keys(req.body));
  }
  next();
});

// Public auth routes
app.post('/api/users/register', userController.register);
app.post('/api/users/login', userController.login);

// Protected user routes
app.get('/api/users/profile', auth, userController.getProfile);
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected task routes
app.get('/api/tasks', auth, taskController.getTasks);
app.post('/api/tasks', auth, taskController.createTask);
app.put('/api/tasks/:id', auth, taskController.updateTask);
app.delete('/api/tasks/:id', auth, taskController.deleteTask);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
