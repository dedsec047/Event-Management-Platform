const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware'); // Correct path to middleware
const router = express.Router();

// Profile Update Route
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Access userId from the decoded token
        const { name, email, password, newPassword, confirmPassword } = req.body;

        // Find the user by the ID attached to the token
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle password update logic (skip password update if not provided)
        if (password && newPassword && confirmPassword) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect current password' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;

        // Save updated user
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

module.exports = router;
