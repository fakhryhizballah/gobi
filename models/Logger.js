const mongoose = require('mongoose');

const loggerSchema = new mongoose.Schema(
    {
        app: {
            type: String,
            required: true
        },
        logid: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        }
    },
    { strict: false },
    { timestamps: true }
);

module.exports = mongoose.model('Logger', loggerSchema);
