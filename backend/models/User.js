const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name:             { type: String, required: true, unique: true, trim: true },
    email:                 { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash:         { type: String, required: true },
    role_id:               { type: Number, required: true, default: 2 }, // 1 = admin, 2 = student
    dept_id:               { type: Number, required: true },
    dept_name:             { type: String, default: '' },
    is_verified:           { type: Boolean, default: false },
    verify_token:          { type: String, default: null },
    verify_token_expires:  { type: Date,   default: null },
    created_at:            { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
