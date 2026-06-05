const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedOpportunity = require('../models/SavedOpportunity');
const Opportunity = require('../models/Opportunity');
const Notification = require('../models/Notification');

// GET /api/bookmarks
router.get('/', auth, async (req, res) => {
    try {
        const saved = await SavedOpportunity
            .find({ user_id: req.user.user_id })
            .populate('opp_id')
            .sort({ saved_at: -1 })
            .lean();

        const opportunities = saved
            .filter(s => s.opp_id)
            .map(s => {
                const o = s.opp_id;
                return {
                    opp_id:        o._id.toString(),
                    title:         o.title,
                    description:   o.description,
                    category:      o.category_name,
                    category_name: o.category_name,
                    department:    o.dept_name,
                    dept_name:     o.dept_name,
                    deadline:      o.deadline,
                    mode:          o.opp_mode,
                    opp_mode:      o.opp_mode,
                    is_paid:       o.is_paid ? 1 : 0,
                    views_count:   o.views_count,
                    save_count:    o.save_count,
                };
            });

        res.json(opportunities);
    } catch (err) {
        console.error('Get bookmarks error:', err);
        res.status(500).json({ message: 'Server error fetching saved opportunities.' });
    }
});

// POST /api/bookmarks
router.post('/', auth, async (req, res) => {
    const { opp_id } = req.body;
    if (!opp_id) return res.status(400).json({ message: 'opp_id is required.' });

    try {
        await SavedOpportunity.create({ user_id: req.user.user_id, opp_id });
        await Opportunity.findByIdAndUpdate(opp_id, { $inc: { save_count: 1 } });
        res.status(201).json({ message: 'Opportunity saved successfully.' });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: 'Already saved.' });
        console.error('Bookmark save error:', err);
        res.status(500).json({ message: 'Server error saving opportunity.' });
    }
});

// DELETE /api/bookmarks/:opp_id
router.delete('/:opp_id', auth, async (req, res) => {
    try {
        const deleted = await SavedOpportunity.findOneAndDelete({
            user_id: req.user.user_id,
            opp_id:  req.params.opp_id,
        });
        if (deleted) {
            await Opportunity.findByIdAndUpdate(req.params.opp_id, { $inc: { save_count: -1 } });
        }
        res.json({ message: 'Bookmark removed.' });
    } catch (err) {
        console.error('Bookmark delete error:', err);
        res.status(500).json({ message: 'Server error removing bookmark.' });
    }
});

// GET /api/bookmarks/notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification
            .find({ user_id: req.user.user_id })
            .sort({ created_at: -1 })
            .limit(20)
            .lean();

        res.json(notifications.map(n => ({
            notif_id:   n._id,
            message:    n.message,
            is_read:    n.is_read ? 1 : 0,
            created_at: n.created_at,
        })));
    } catch (err) {
        console.error('Notifications error:', err);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
});

module.exports = router;
