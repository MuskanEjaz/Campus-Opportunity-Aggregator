const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SavedOpportunity = require('../models/SavedOpportunity');
const verifyToken = require('../middleware/auth');
const { getDeptName, getCategoryName } = require('../config/constants');

// GET /api/admin/stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const [total_active, total_expired, total_students, total_saves] = await Promise.all([
            Opportunity.countDocuments({ status: 'active' }),
            Opportunity.countDocuments({ status: 'expired' }),
            User.countDocuments({ role_id: 2 }),
            SavedOpportunity.countDocuments(),
        ]);
        res.json({ success: true, data: { total_active, total_expired, total_students, total_saves } });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    }
});

// GET /api/admin/opportunities
router.get('/opportunities', verifyToken, async (req, res) => {
    try {
        const opps = await Opportunity.find().sort({ created_at: -1 }).lean();
        res.json({
            success: true,
            data: opps.map(o => ({
                opp_id:           o._id.toString(),
                title:            o.title,
                organization:     o.organization,
                category:         o.category_name,
                department:       o.dept_name,
                deadline:         o.deadline,
                status:           o.status,
                mode:             o.opp_mode,
                opp_mode:         o.opp_mode,
                location:         o.location,
                is_paid:          o.is_paid ? 1 : 0,
                stipend:          o.stipend,
                duration:         o.duration,
                required_skills:  o.required_skills,
                eligibility:      o.eligibility,
                application_link: o.application_link,
                tags:             o.tags,
                views_count:      o.views_count,
                save_count:       o.save_count,
            })),
        });
    } catch (err) {
        console.error('Admin opps error:', err);
        res.status(500).json({ success: false, message: 'Error fetching opportunities' });
    }
});

// POST /api/admin/opportunities
router.post('/opportunities', verifyToken, async (req, res) => {
    if (req.user.role_id !== 1) {
        return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const {
        title, description, organization, category_id, dept_id,
        deadline, opp_mode, location, is_paid, stipend, duration,
        required_skills, eligibility, application_link, tags,
    } = req.body;
    if (!title || !description || !category_id || !dept_id || !deadline || !opp_mode) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const category_name = getCategoryName(category_id);
        const dept_name     = getDeptName(dept_id);

        const opp = await Opportunity.create({
            title,
            description,
            organization:     organization || '',
            category_id:      Number(category_id),
            category_name,
            dept_id:          Number(dept_id),
            dept_name,
            deadline:         new Date(deadline),
            opp_mode,
            location:         location || '',
            is_paid:          !!is_paid,
            stipend:          stipend || '',
            duration:         duration || '',
            required_skills:  Array.isArray(required_skills) ? required_skills : [],
            eligibility:      eligibility || '',
            application_link: application_link || '',
            tags:             Array.isArray(tags) ? tags : [],
            posted_by:        req.user.user_id,
        });

        // Notify all students (replaces Oracle trigger trg_notify_on_new)
        const students = await User.find({ role_id: 2 }, '_id').lean();
        if (students.length > 0) {
            const notifications = students.map(s => ({
                user_id: s._id,
                opp_id:  opp._id,
                message: `New opportunity posted: ${title}`,
                is_read: false,
            }));
            await Notification.insertMany(notifications, { ordered: false });
        }

        res.status(201).json({ success: true, message: 'Opportunity posted successfully.' });
    } catch (err) {
        console.error('Post opportunity error:', err);
        res.status(500).json({ success: false, message: 'Error posting opportunity.' });
    }
});

// DELETE /api/admin/opportunities/:id
router.delete('/opportunities/:id', verifyToken, async (req, res) => {
    if (req.user.role_id !== 1) {
        return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    try {
        await Opportunity.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Opportunity deleted' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ success: false, message: 'Error deleting opportunity' });
    }
});

// GET /api/admin/expiring
router.get('/expiring', verifyToken, async (req, res) => {
    try {
        const now           = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        const opps = await Opportunity.find({
            status:   'active',
            deadline: { $gte: now, $lte: threeDaysLater },
        }).lean();

        res.json({
            success: true,
            data: opps.map(o => ({
                opp_id:      o._id.toString(),
                title:       o.title,
                description: o.description,
                category:    o.category_name,
                department:  o.dept_name,
                deadline:    o.deadline,
                mode:        o.opp_mode,
                is_paid:     o.is_paid ? 1 : 0,
                views_count: o.views_count,
                save_count:  o.save_count,
            })),
        });
    } catch (err) {
        console.error('Expiring error:', err);
        res.status(500).json({ success: false, message: 'Error fetching expiring opportunities' });
    }
});

// GET /api/admin/recommendations/:user_id
router.get('/recommendations/:user_id', verifyToken, async (req, res) => {
    try {
        // Derive interests from the user's saved opportunities
        const saved = await SavedOpportunity
            .find({ user_id: req.params.user_id })
            .populate('opp_id', 'category_id')
            .lean();

        const interestedCategories = [
            ...new Set(saved.map(s => s.opp_id?.category_id).filter(Boolean))
        ];

        const filter = { status: 'active', deadline: { $gte: new Date() } };
        if (interestedCategories.length > 0) {
            filter.category_id = { $in: interestedCategories };
        }

        const opps = await Opportunity
            .find(filter)
            .sort({ views_count: -1, save_count: -1 })
            .limit(10)
            .populate('posted_by', 'user_name')
            .lean();

        res.json({
            success: true,
            data: opps.map(o => ({
                opp_id:      o._id.toString(),
                title:       o.title,
                description: o.description,
                category:    o.category_name,
                department:  o.dept_name,
                deadline:    o.deadline,
                mode:        o.opp_mode,
                is_paid:     o.is_paid ? 1 : 0,
                views_count: o.views_count,
                save_count:  o.save_count,
                posted_by:   o.posted_by?.user_name,
                trend_score: Math.round((o.views_count * 0.4 + o.save_count * 0.6) * 100) / 100,
            })),
        });
    } catch (err) {
        console.error('Recommendations error:', err);
        res.status(500).json({ success: false, message: 'Error fetching recommendations' });
    }
});

module.exports = router;
