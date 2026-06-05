const mongoose = require('mongoose');

const savedOpportunitySchema = new mongoose.Schema({
    user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },
    opp_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    saved_at: { type: Date, default: Date.now },
});

savedOpportunitySchema.index({ user_id: 1, opp_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedOpportunity', savedOpportunitySchema);
