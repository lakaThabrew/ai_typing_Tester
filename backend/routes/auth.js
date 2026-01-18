import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            username: name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            name: user.username,
            email: user.email,
            currentStage: user.currentStage,
            currentLevel: user.currentLevel,
            maxStageReached: user.maxStageReached,
            tests: user.tests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            token,
            id: user._id,
            name: user.username,
            email: user.email,
            currentStage: user.currentStage,
            currentLevel: user.currentLevel,
            maxStageReached: user.maxStageReached,
            tests: user.tests
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Password
router.put('/update-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Email
router.put('/update-email', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            return res.status(400).json({ message: 'New email and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        user.email = newEmail;
        await user.save();

        res.json({
            message: 'Email updated successfully',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile Name
router.put('/update-name', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = name.trim();
        await user.save();

        res.json({
            message: 'Name updated successfully',
            name: user.username
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;