const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        views: { type: Number, default: 0 },
        timestamps: {
            type: Date,
            required: true
        },
        visitorInfo: { type: mongoose.Schema.Types.Mixed },
        date: { type: Date, default: Date.now }
    },
    { strict: false, timestamps: true },
);

module.exports = mongoose.model('Visitor', visitorSchema);
