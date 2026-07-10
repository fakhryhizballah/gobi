const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        views: { type: Number, default: 0 },
        // Mengganti meta menjadi array of objects untuk mencatat histori
        viewLogs: [{
            viewedAt: { type: Date, default: Date.now },
            visitorInfo: { type: mongoose.Schema.Types.Mixed } // Bisa diisi IP, User-Agent, dll
        }],
        date: { type: Date, default: Date.now },
    },
    // Opsi schema digabung ke dalam satu object
    { strict: false, timestamps: true }
);

const Logger = mongoose.model('Page', pageSchema);
module.exports = Logger;