const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title:            { type: String, required: true, minlength: 5 },
    description:      { type: String, required: true },
    organization:     { type: String, default: '' },
    category_id:      { type: Number, required: true },
    category_name:    { type: String, required: true },
    dept_id:          { type: Number, required: true },
    dept_name:        { type: String, required: true },
    deadline:         { type: Date, required: true },
    status:           { type: String, enum: ['active', 'expired', 'pending'], default: 'active' },
    opp_mode:         { type: String, enum: ['remote', 'on-campus', 'hybrid'], required: true },
    location:         { type: String, default: '' },
    is_paid:          { type: Boolean, default: false },
    stipend:          { type: String, default: '' },
    duration:         { type: String, default: '' },
    required_skills:  [{ type: String }],
    eligibility:      { type: String, default: '' },
    application_link: { type: String, default: '' },
    tags:             [{ type: String }],
    views_count:      { type: Number, default: 0 },
    save_count:       { type: Number, default: 0 },
    posted_by:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at:       { type: Date, default: Date.now },
});

opportunitySchema.pre('save', function (next) {
    if (this.deadline < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

// Compound indexes for common filter patterns
opportunitySchema.index({ status: 1, deadline: 1 });
opportunitySchema.index({ status: 1, deadline: 1, category_id: 1 });
opportunitySchema.index({ status: 1, deadline: 1, dept_id: 1 });
opportunitySchema.index({ status: 1, deadline: 1, opp_mode: 1 });
opportunitySchema.index({ status: 1, deadline: 1, is_paid: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
