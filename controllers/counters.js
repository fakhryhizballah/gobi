const Page = require('../models/Page');
const Visitor = require('../models/Visitor');

module.exports = {

    postView: async (req, res) => {
        let page = await Page.create({
            url: req.body.url,
            meta: {
                ip: req.body.ip, uid: req.body.uid ? req.body.uid : null,
                visitorInfo: req.body.visitorInfo
            }
        });
        return res.status(201).json({
            message: 'ok'
        });
    },
    getPageViews: async (req, res) => {
        const page = await Page.countDocuments({
            url: req.query.url
        });
        return res.status(201).json({
            message: req.query.url,
            data: page
        });
    }

}
