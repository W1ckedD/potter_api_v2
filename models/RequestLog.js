const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    type: String,
    method: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RequestLog', requestLogSchema);