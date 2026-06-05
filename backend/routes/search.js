const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

function formatOpportunity(o) {
    return {
        opp_id:           o._id.toString(),
        title:            o.title,
        description:      o.description,
        organization:     o.organization,
        category:         o.category_name,
        category_name:    o.category_name,
        department:       o.dept_name,
        dept_name:        o.dept_name,
        deadline:         o.deadline,
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
        posted_by:        o.posted_by?.user_name || o.posted_by,
        created_at:       o.created_at,
        status:           o.status,
    };
}

// GET /api/search
router.get('/', async (req, res) => {
    try {
        const filter = {
            status:   'active',
            deadline: { $gte: new Date() },
        };

        if (req.query.category_id) filter.category_id = Number(req.query.category_id);
        if (req.query.dept_id)     filter.dept_id     = Number(req.query.dept_id);
        if (req.query.opp_mode)    filter.opp_mode    = req.query.opp_mode;
        if (req.query.is_paid !== undefined && req.query.is_paid !== '') {
            filter.is_paid = req.query.is_paid === '1' || req.query.is_paid === 'true';
        }

        const opps = await Opportunity
            .find(filter,
                'title description organization category_name dept_name ' +
                'deadline opp_mode location is_paid stipend duration ' +
                'required_skills eligibility application_link tags ' +
                'views_count save_count posted_by created_at status'
            )
            .populate('posted_by', 'user_name')
            .sort({ deadline: 1 })
            .lean();

        res.json({ success: true, count: opps.length, data: opps.map(formatOpportunity) });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching opportunities' });
    }
});

// GET /api/search/:id
router.get('/:id', async (req, res) => {
    try {
        const opp = await Opportunity
            .findById(req.params.id)
            .populate('posted_by', 'user_name')
            .lean();

        if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });

        res.json({ success: true, data: formatOpportunity(opp) });
    } catch (err) {
        console.error('Get opportunity error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching opportunity' });
    }
});

// POST /api/search/:id/view
router.post('/:id/view', async (req, res) => {
    try {
        await Opportunity.findByIdAndUpdate(req.params.id, { $inc: { views_count: 1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
