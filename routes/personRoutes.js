import express from 'express';
import Person from '../models/person.js';
import { jwtAuthMiddleware, generateToken } from '../jwt.js';

const router = express.Router();


// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const newPerson = new Person(data);
        const savedPerson = await newPerson.save();

        const token = generateToken(savedPerson);

        res.status(201).json({
            token
        });

    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(409).json({
                error: 'Username or email already exists'
            });
        }

        res.status(500).json({
            error: err.message
        });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const person = await Person.findOne({ username });

        if (!person) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const isMatch = await person.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const token = generateToken(person);

        // ONLY TOKEN
        res.status(200).json({
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error'
        });
    }
});


// GET LOGGED-IN USER PROFILE ONLY
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const person = await Person.findById(req.user.id).select('-password');

        if (!person) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(person);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch profile'
        });
    }
});


// GET BY WORK TYPE
router.get('/:work', async (req, res) => {
    try {
        const work = req.params.work;

        if (!['chef', 'waiter', 'manager'].includes(work)) {
            return res.status(400).json({
                error: 'Invalid work type'
            });
        }

        const people = await Person.find({ work }).select('-password');

        res.status(200).json(people);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch people'
        });
    }
});


// UPDATE OWN PROFILE
router.put('/profile/update', jwtAuthMiddleware, async (req, res) => {
    try {
        const updatedPerson = await Person.findByIdAndUpdate(
            req.user.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        res.status(200).json(updatedPerson);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to update profile'
        });
    }
});


// DELETE OWN PROFILE
router.delete('/profile/delete', jwtAuthMiddleware, async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.user.id);

        res.status(200).json({
            message: 'Profile deleted successfully'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to delete profile'
        });
    }
});

export default router;