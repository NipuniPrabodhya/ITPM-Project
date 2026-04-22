const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../config/generateToken');
const { protect } = require('../middleware/authMiddleware');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        role: role || 'student',
        phone: phone || ''
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            token: generateToken(user.id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        if (!user.active) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profileImg: user.profileImg,
            token: generateToken(user.id)
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        const oldUsername = user.username;
        const newUsername = req.body.username || user.username;

        user.username = newUsername;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profileImg = req.body.profileImg || user.profileImg;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Sync username changes to products
        if (oldUsername !== newUsername) {
            const Product = require('../models/Product');
            await Product.updateMany({ owner: oldUsername }, { owner: newUsername });
            await Product.updateMany({ cartOwner: oldUsername }, { cartOwner: newUsername });
            await Product.updateMany({ buyer: oldUsername }, { buyer: newUsername });
        }

        res.json({
            _id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            profileImg: updatedUser.profileImg,
            token: generateToken(updatedUser.id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
router.get('/users', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized as an admin' });
        }
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle user status (Admin)
// @route   PUT /api/auth/users/:id/status
router.put('/users/:id/status', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized as an admin' });
        }
        const user = await User.findById(req.params.id);
        if (user) {
            user.active = !user.active;
            await user.save();
            res.json({ message: `User ${user.active ? 'activated' : 'deactivated'}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user by username
// @route   GET /api/auth/user/:username
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password -email -phone');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Rate a seller
// @route   POST /api/auth/rate/:username
router.post('/rate/:username', protect, async (req, res) => {
    try {
        const { rating } = req.body;
        const seller = await User.findOne({ username: req.params.username });

        if (seller) {
            if (seller.username === req.user.username) {
                return res.status(400).json({ message: 'You cannot rate yourself' });
            }

            // Check if buyer already rated
            const alreadyRated = seller.ratings.find(r => r.buyer === req.user.username);
            if (alreadyRated) {
                alreadyRated.rating = rating;
            } else {
                seller.ratings.push({ buyer: req.user.username, rating });
            }

            // Calculate trust score (average)
            const totalRating = seller.ratings.reduce((acc, item) => item.rating + acc, 0);
            seller.trustScore = totalRating / seller.ratings.length;

            await seller.save();
            res.json({ message: 'Rating added', trustScore: seller.trustScore });
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user (Admin)
// @route   PUT /api/auth/users/:id
router.put('/users/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized as an admin' });
        }
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldUsername = user.username;
        const newUsername = req.body.username || user.username;

        // Check if username/email already taken by another user
        if (req.body.username && req.body.username !== oldUsername) {
            const userExists = await User.findOne({ username: req.body.username });
            if (userExists) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }

        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already taken' });
            }
        }

        user.username = newUsername;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role;
        
        // Only update password if it's a new string and not the placeholder or empty
        if (req.body.password && req.body.password !== "" && req.body.password !== "••••••••") {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        // Sync username changes to products
        if (oldUsername !== newUsername) {
            const Product = require('../models/Product');
            await Product.updateMany({ owner: oldUsername }, { owner: newUsername });
            await Product.updateMany({ cartOwner: oldUsername }, { cartOwner: newUsername });
            await Product.updateMany({ buyer: oldUsername }, { buyer: newUsername });
        }

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            active: updatedUser.active
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // In a real app, send email here. For now, return token for testing/demo.
        console.log(`Reset Token for ${email}: ${resetToken}`);
        
        res.json({ 
            message: 'Password reset instructions sent (check console for token in this demo)',
            token: resetToken // Returning token directly for this project's convenience
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
