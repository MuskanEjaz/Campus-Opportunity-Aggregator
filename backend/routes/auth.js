const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { getDeptName }          = require('../config/constants');
const { validateEmailDomain, sendWelcomeEmail } = require('../utils/email');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { user_name, email, password, dept_id } = req.body;

    if (!user_name || !email || !password || !dept_id) {
        return res.status(400).json({ message: 'Username, email, password, and department are required.' });
    }

    const domainValid = await validateEmailDomain(email);
    if (!domainValid) {
        return res.status(400).json({
            message: 'The email address does not appear to be valid. Please use a real, deliverable email address.'
        });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const dept_name     = getDeptName(dept_id);

        await User.create({
            user_name,
            email:       email.toLowerCase(),
            password_hash,
            role_id:     2,
            dept_id:     Number(dept_id),
            dept_name,
            is_verified: true,
        });

        // Send welcome confirmation email (fire-and-forget)
        sendWelcomeEmail(email, user_name)
            .then(() => console.log('[Email] Welcome email sent to:', email))
            .catch(err => console.error('[Email] Welcome email failed:', err.message));

        res.status(201).json({ message: 'Account created successfully! You can now log in.' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const identifier = email.toLowerCase();
        const user = await User.findOne({
            $or: [{ email: identifier }, { user_name: identifier }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { user_id: user._id, user_name: user.user_name, email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful.',
            token,
            user: { user_id: user._id, user_name: user.user_name, email: user.email, role_id: user.role_id }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;
