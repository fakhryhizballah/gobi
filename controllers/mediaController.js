require('dotenv').config();
const {convertExcelToJson} = require('../helpers/tojson');
const Gaji = require('../models/Gaji');
const http = process.env.URL_STATE || "http";
module.exports = {
    file: async (req, res) => {
        try {
            let periode = req.body.periode;
            if (!periode) {
                return res.status(400).json({
                    status: false,
                    message: "Periode Tidak Ada",
                    data: null
                });
            }
            if (!req.body.status) {
                return res.status(400).json({
                    status: false,
                    message: "Status Tidak Ada",
                    data: null
                });
            }
            let isexis = await Gaji.findOne({ periode: periode, status: req.body.status });
            if (isexis) {
                return res.status(400).json({
                    status: false,
                    message: "Periode Sudah Ada",
                    data: null
                });
            }
          let fileJson = await convertExcelToJson(req.file.filename);
            const keys = Object.keys(fileJson);
            let data = [];
            for (let i = 0; i < keys.length; i++) {
              data = [...data, ...fileJson[keys[i]]];
            }
            // console.log(data[0])
            if (!data[0].jumlah_ditransfer) {
                return res.status(400).json({
                    status: false,
                    message: "Jumlah Ditransfer Tidak Ada",
                    data: null
                });
            }
            for (let i = 0; i < data.length; i++) {
                data[i].periode = req.body.periode;
                data[i].status = req.body.status;
            }
            let result = await Gaji.create(data);
            console.log(result);
            const file = ({
                title: req.file.filename,
                periode: req.body.periode,
                size: req.file.size / 1024 + 'kb',
                file: req.file,
                keys: keys,
                json: data
            });

            res.status(200).json({
                status: true,
                message: "success",
                data: file
            });

        } catch (err) {
            console.log(err);
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    deleteFile: async (req, res) => {
        try {
            await Gaji.deleteMany({ periode: req.query.periode });
            res.status(200).json({
                status: true,
                message: "success",
                data: null
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    },
    findGajiAsn: async (req, res) => {
        try {
            if (Object.keys(req.query).length === 0) {
                return res.json([]);
            }
            let data = await Gaji.find(req.query).limit(10).sort({ date: -1 });
            res.status(200).json({
                status: true,
                message: "success",
                data: data
            });
        } catch (err) {
            return res.status(400).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    }
}