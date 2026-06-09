import express from 'express';
import Menu from '../models/menu.js';
import { jwtAuthMiddleware } from '../jwt.js';
import Person from '../models/person.js';
import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory for simplicity

const upload = multer({ storage });

const router = express.Router();

// Middleware: only allows managers to proceed
const managerOnly = async (req, res, next) => {
  try {
    const person = await Person.findById(req.user.id);
    if (!person || person.work !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Managers only.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// POST /menu — Add a new menu item (managers only)
router.post('/', jwtAuthMiddleware, managerOnly, upload.single('photo'), async (req, res, next) => {
  try {
    const newMenu = new Menu(req.body);
    const savedMenu = await newMenu.save();
    
    const photoBase64 = req.file ? req.file.buffer.toString('base64') : null;
    if (photoBase64) {
      savedMenu.photo = `data:${req.file.mimetype};base64,${photoBase64}`;
      await savedMenu.save();
    }

    res.status(201).json(savedMenu);
  } catch (err) {
    // Mongoose validation errors → 400 instead of 500
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// GET /menu — Get all menu items with pagination
// Usage: GET /menu?page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10); // cap at 50
    const skip = (page - 1) * limit;

    const [menus, total] = await Promise.all([
      Menu.find().skip(skip).limit(limit),
      Menu.countDocuments()
    ]);

    res.json({
      data: menus,
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

// GET /menu/:taste — Get menu items filtered by taste
router.get('/:taste', async (req, res, next) => {
  try {
    const { taste } = req.params;

    if (!['sweet', 'salty', 'sour'].includes(taste)) {
      return res.status(400).json({ error: 'Invalid taste. Must be: sweet, salty, or sour' });
    }

    const menus = await Menu.find({ taste });
    res.json(menus);
  } catch (err) {
    next(err);
  }
});

// DELETE /menu/:id — Delete a menu item (managers only)
router.delete('/:id', jwtAuthMiddleware, managerOnly, async (req, res, next) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;