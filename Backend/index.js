const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { z } = require('zod');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Schemas
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes

// Signup
app.post('/signup', async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: result.error.flatten().fieldErrors 
      });
    }

    const { name, email, password } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin
app.post('/signin', async (req, res) => {
  try {
    const result = signinSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: result.error.flatten().fieldErrors 
      });
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(200).json({ 
      message: 'Signin successful', 
      token,
      user: { name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});