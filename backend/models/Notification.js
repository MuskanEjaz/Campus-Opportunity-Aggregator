const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',        required: true },
    opp_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', default: null },
    message:    { type: String, required: true },
    is_read:    { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
});

notificationSchema.index({ user_id: 1, created_at: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
