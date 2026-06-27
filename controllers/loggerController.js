const Logger = require('../models/Logger');

exports.getAllLogs = async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0) {
            return res.json([]);
        }
        const logs = await Logger.find(
            req.query
        ).limit(10).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.delLog = async (req, res) => {
    try {
        const log = await Logger.deleteMany(req.query).limit(10);
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLog = async (req, res) => {
    try {
        const log = new Logger(req.body);
         log.save();
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};