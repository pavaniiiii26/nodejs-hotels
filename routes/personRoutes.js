import express from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import Person from '../models/person.js';
import { jwtAuthMiddleware, generateToken } from '../jwt.js';

const router = express.Router();

// Stricter rate limiter for login/signup — max 10 attempts per 15 mins
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' }
});


// POST /person/signup
router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const newPerson = new Person(req.body);
    const savedPerson = await newPerson.save();
    const token = generateToken(savedPerson);
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});


// POST /person/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const person = await Person.findOne({ username });

    // Use same message for both cases to avoid username enumeration
    if (!person) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await person.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(person);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});


// GET /person/profile — Get logged-in user's profile
router.get('/profile', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const person = await Person.findById(req.user.id).select('-password');

    if (!person) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(person);
  } catch (err) {
    next(err);
  }
});


// GET /person/:work — Get all people by work type, with pagination
// Usage: GET /person/chef?page=1&limit=10
router.get('/:work', async (req, res, next) => {
  try {
    const { work } = req.params;

    if (!['chef', 'waiter', 'manager'].includes(work)) {
      return res.status(400).json({ error: 'Invalid work type. Must be: chef, waiter, or manager' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [people, total] = await Promise.all([
      Person.find({ work }).select('-password').skip(skip).limit(limit),
      Person.countDocuments({ work })
    ]);

    res.status(200).json({
      data: people,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});


// PUT /person/profile/update — Update own profile
// IMPORTANT: password changes are handled separately and re-hashed correctly
router.put('/profile/update', jwtAuthMiddleware, async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // If the user is trying to change their password, hash it manually
    // because findByIdAndUpdate bypasses the pre('save') hook
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedPerson = await Person.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedPerson) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedPerson);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});


// DELETE /person/profile/delete — Delete own profile
router.delete('/profile/delete', jwtAuthMiddleware, async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;