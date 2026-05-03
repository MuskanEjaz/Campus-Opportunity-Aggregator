const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { full_name, email, password, dept_id } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required.' });
  }

  try {
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    // Check if email already exists
    const existing = await conn.execute(
      `SELECT user_id FROM users WHERE email = :email`,
      [email]
    );

    if (existing.rows.length > 0) {
      await conn.close();
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user (role_id = 2 means student)
    await conn.execute(
      `INSERT INTO users (full_name, email, password_hash, role_id, dept_id)
       VALUES (:full_name, :email, :password_hash, 2, :dept_id)`,
      {
        full_name,
        email,
        password_hash: hashedPassword,
        dept_id: dept_id || null
      },
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
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    const result = await conn.execute(
      `SELECT user_id, full_name, email, password_hash, role_id FROM users WHERE email = :email`,
      [email]
    );

    await conn.close();

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    // Oracle returns rows as arrays: [user_id, full_name, email, password_hash, role_id]
    const [user_id, full_name, userEmail, password_hash, role_id] = user;

    const passwordMatch = await bcrypt.compare(password, password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Sign the JWT token
    const token = jwt.sign(
      { user_id, full_name, email: userEmail, role_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { user_id, full_name, email: userEmail, role_id }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;