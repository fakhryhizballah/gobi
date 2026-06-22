const Logger = require('../models/Logger');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Logger.find(
            req.query
        );
        res.json(logs);
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