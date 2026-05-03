const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/bookmarks — get all saved opportunities for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    const result = await conn.execute(
      `SELECT o.opp_id, o.title, o.description, o.deadline, o.opp_mode,
              o.is_paid, o.views_count, o.save_count,
              c.category_name, d.dept_name
       FROM saved_opportunities s
       JOIN opportunities o ON s.opp_id = o.opp_id
       LEFT JOIN categories c ON o.category_id = c.category_id
       LEFT JOIN departments d ON o.dept_id = d.dept_id
       WHERE s.user_id = :user_id
       ORDER BY s.saved_at DESC`,
      [req.user.user_id]
    );

    const columns = result.metaData.map(col => col.name.toLowerCase());
    const opportunities = result.rows.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });

    await conn.close();
    res.json(opportunities);

  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Server error fetching saved opportunities.' });
  }
});

// POST /api/bookmarks — save an opportunity
router.post('/', auth, async (req, res) => {
  const { opp_id } = req.body;

  if (!opp_id) {
    return res.status(400).json({ message: 'opp_id is required.' });
  }

  try {
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    // Check if already saved
    const existing = await conn.execute(
      `SELECT save_id FROM saved_opportunities WHERE user_id = :user_id AND opp_id = :opp_id`,
      [req.user.user_id, opp_id]
    );

    if (existing.rows.length > 0) {
      await conn.close();
      return res.status(409).json({ message: 'Already saved.' });
    }

    await conn.execute(
      `INSERT INTO saved_opportunities (user_id, opp_id) VALUES (:user_id, :opp_id)`,
      [req.user.user_id, opp_id],
      { autoCommit: true }
    );

    await conn.close();
    res.status(201).json({ message: 'Opportunity saved successfully.' });

  } catch (err) {
    console.error('Bookmark save error:', err);
    res.status(500).json({ message: 'Server error saving opportunity.' });
  }
});

// DELETE /api/bookmarks/:opp_id — remove a bookmark
router.delete('/:opp_id', auth, async (req, res) => {
  const { opp_id } = req.params;

  try {
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    await conn.execute(
      `DELETE FROM saved_opportunities WHERE user_id = :user_id AND opp_id = :opp_id`,
      [req.user.user_id, opp_id],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ message: 'Bookmark removed.' });

  } catch (err) {
    console.error('Bookmark delete error:', err);
    res.status(500).json({ message: 'Server error removing bookmark.' });
  }
});

// GET /api/bookmarks/notifications — get notifications for logged-in user
router.get('/notifications', auth, async (req, res) => {
  try {
    const pool = await db.getPool();
    const conn = await pool.getConnection();

    const result = await conn.execute(
      `SELECT notif_id, message, is_read, created_at
       FROM notifications
       WHERE user_id = :user_id
       ORDER BY created_at DESC
       FETCH FIRST 20 ROWS ONLY`,
      [req.user.user_id]
    );

    const columns = result.metaData.map(col => col.name.toLowerCase());
    const notifications = result.rows.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });

    await conn.close();
    res.json(notifications);

  } catch (err) {
    console.error('Notifications error:', err);
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
});

module.exports = router;