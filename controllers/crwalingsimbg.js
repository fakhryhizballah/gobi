const axios = require('axios');
const { convertJsonToExcel } = require('../helpers/tojson');
const path = require('path');

async function login(data) {

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://simbg.pu.go.id/api/user/v1/auth/login/',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        let token = await axios(config)
        return token.data
    } catch (error) {
        console.log(error);
    }
}


async function getlist(token, page, limit) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://simbg.pu.go.id/api/pbg/v1/list/?page=${page}&size=${limit}&sort=ASC&date&search&status&slf_status&type=task&sort_by=created_at`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        let profile = await axios(config)
        return profile.data
    } catch (error) {
        console.log(error);
    }
}
async function getdetail(token, uid) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://simbg.pu.go.id/api/pbg/v1/detail/${uid}/`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        let data = await axios(config)
        return data.data
    } catch (error) {
        console.log(error);
    }
}
async function getstatus(token, uid) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://simbg.pu.go.id/api/pbg/v1/detail/${uid}/status/`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        let data = await axios(config)
        return data.data
    } catch (error) {
        console.log(error);
    }
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = {
    getSIMBGE: async (req, res) => {
        let auth = await req.cache.get(`simbg:user:${req.query.email}:${req.query.password}`);
        if (auth == null) {
            let akun = JSON.stringify({
                "email": req.query.email,
                "password": req.query.password
            });
            try {
                let masuk = await login(akun)
                auth = masuk.token.access
                await req.cache.set(`simbg:user:${req.query.email}:${req.query.password}`,  auth);
                await req.cache.expire(`simbg:user:${req.query.email}:${req.query.password}`,  60 * 60 * 24);
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    message: error
                });
            }
          
        }
        try {
            let limit = req.query.limit || 10;
            let page = req.query.page || 1;
            let cache = await req.cache.get(`simbg:data:${req.query.email}:${page}:${limit}`);
            if (cache != null) {
                // return res.redirect('/api/gobi/static/media/' + cache);
                const outputFilePath = path.join(__dirname, '../public/media', cache);

                // Kirim file ke client sebagai unduhan
                return res.download(outputFilePath, cache, (err) => {
                    if (err) {
                        console.error("Gagal mengunduh file:", err);
                        // Handle error jika file tidak ditemukan atau proses kirim terputus
                        if (!res.headersSent) {
                            res.status(500).send("Gagal mengunduh file.");
                        }
                    }
                });
                
            }
            let datalist = await req.cache.json.get(`simbg:list:${req.query.email}:${page}:${limit}`,'$');
            if (datalist == null) {
                 datalist = await getlist(auth,page, limit);
                await req.cache.json.set(`simbg:list:${req.query.email}:${page}:${limit}`,'$', datalist);
                await req.cache.expire(`simbg:list:${req.query.email}:${page}:${limit}`,  60 * 60);
            }
            let mydata = [];

            for (let x of datalist.data) {
                let y = x
                let dataStatus = await getstatus(auth, x.uid)
                y = { ...y, ...dataStatus.data }
                let dataDetail = await getdetail(auth, x.uid)
                y = { ...y, ...dataDetail.data }
                mydata.push(y)
                await delay(100);
            }
            let filename = await convertJsonToExcel(mydata, `SIMBG-${page}-${limit}`);
            await req.cache.set(`simbg:data:${req.query.email}:${page}:${limit}`, filename);
            await req.cache.expire(`simbg:data:${req.query.email}:${page}:${limit}`,  60 * 60);
            const outputFilePath = path.join(__dirname, '../public/media', filename);

            // Kirim file ke client sebagai unduhan
            return res.download(outputFilePath, filename, (err) => {
                if (err) {
                    console.error("Gagal mengunduh file:", err);
                    // Handle error jika file tidak ditemukan atau proses kirim terputus
                    if (!res.headersSent) {
                        res.status(500).send("Gagal mengunduh file.");
                    }
                }
            });
            // return res.status(200).json({
            //     filename: filename,
            //     message: mydata
            // });
           
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error
            });
        }
       
    },

}
