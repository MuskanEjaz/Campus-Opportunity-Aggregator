const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { user_name, email, password, dept_id } = req.body;

  if (!user_name || !email || !password || !dept_id) {
    return res.status(400).json({ message: 'Username, email, password, and department are required.' });
  }

  try {
    const conn = await db.getConnection();

    // Check if email already exists
    const existing = await conn.execute(
      `SELECT user_id FROM users WHERE email = :email`,
      [email]
    );

    if (existing.rows.length > 0) {
      await conn.close();
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // role_id = 2 means student
    await conn.execute(
      `INSERT INTO users (user_name, email, password_hash, role_id, dept_id)
       VALUES (:user_name, :email, :password_hash, 2, :dept_id)`,
      { user_name, email, password_hash: hashedPassword, dept_id },
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Account created successfully. Please log in.' });

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
    const conn = await db.getConnection();

    const result = await conn.execute(
      `SELECT user_id, user_name, email, password_hash, role_id
       FROM users WHERE email = :email`,
      [email]
    );

    await conn.close();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const [user_id, user_name, userEmail, password_hash, role_id] = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { user_id, user_name, email: userEmail, role_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { user_id, user_name, email: userEmail, role_id }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;