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
let onProsses = 0;
async function crawaling(req, page, limit, periode) {
    // await cache.set(`simbg:test:${page}:${limit}`, "coba");
    onProsses = 1;
    let auth = await req.cache.get(`simbg:user:${req.query.email}:${req.query.password}`);
    if (auth == null) {
        let akun = JSON.stringify({
            "email": req.query.email,
            "password": req.query.password
        });
        try {
            let masuk = await login(akun)
            auth = masuk.token.access
            await req.cache.set(`simbg:user:${req.query.email}:${req.query.password}`, auth);
            await req.cache.expire(`simbg:user:${req.query.email}:${req.query.password}`, 60 * 60 * 24);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error
            });
        }

    }

    let datalist = await req.cache.json.get(`simbg:list:${req.query.email}:${page}:${limit}`, '$');
    if (datalist == null) {
        datalist = await getlist(auth, page, limit);
        await req.cache.json.set(`simbg:list:${req.query.email}:${page}:${limit}`, '$', datalist);
        await req.cache.expire(`simbg:list:${req.query.email}:${page}:${limit}`, 60 * 60 * 2);
    }
    let mydata = [];
    for (let x of datalist.data) {
        let y = x
        let dataStatus = await req.cache.json.get(`simbg:status:${req.query.email}:${x.uid}`, '$');
        if (dataStatus == null) {
            dataStatus = await getstatus(auth, x.uid)
            await req.cache.json.set(`simbg:status:${req.query.email}:${x.uid}`, '$', dataStatus);
            await req.cache.expire(`simbg:status:${req.query.email}:${x.uid}`, 60 * 60 * 4);
            await delay(2000);
        }
        y = { ...y, ...dataStatus.data }
        let dataDetail = await req.cache.json.get(`simbg:detail:${req.query.email}:${x.uid}`, '$');
        if (dataDetail == null) {
            dataDetail = await getdetail(auth, x.uid)
            await req.cache.json.set(`simbg:detail:${req.query.email}:${x.uid}`, '$', dataDetail);
            await req.cache.expire(`simbg:detail:${req.query.email}:${x.uid}`, 60 * 60 * 4);
            await delay(3000);
        }
        y = { ...y, ...dataDetail.data }
        mydata.push(y)
        let process = await req.cache.incr(`simbg:process:${req.query.email}:${page}:${limit}`);
        req.cache.expire(`simbg:process:${req.query.email}:${page}:${limit}`, 60 * 60 * 24);
        console.log(`Proses ${process} ${req.query.email} ${page} ${limit}`);
    }
    let filename = await convertJsonToExcel(mydata, `${periode}-SIMBG-${page}-${limit}`);
    await req.cache.set(`simbg:data:${req.query.email}:${page}:${limit}`, filename);
    await req.cache.expire(`simbg:data:${req.query.email}:${page}:${limit}`, 60 * 60 * 12);
    await req.cache.del(`simbg:process:${req.query.email}:${page}:${limit}`);
    process = 0;
    const outputFilePath = path.join(__dirname, '../public/media', filename);
}
module.exports = {
    getSIMBGE: async (req, res) => {
        try {
            let limit = req.query.limit || 10;
            let page = req.query.page || 1;
            let datenow = new Date();
            let date = datenow.toISOString().split('T')[0];
            let cache = await req.cache.get(`simbg:data:${req.query.email}:${page}:${limit}`);
            if (cache != null) {
                return res.redirect('/api/gobi/static/media/' + cache);

                return res.status(200).json({
                    massage: "success",
                    filename: '/api/gobi/static/media/' + cache

                })

            }
            let prosess = await req.cache.get(`simbg:process:${req.query.email}:${page}:${limit}`);
            if (prosess == null) {
                if (onProsses == 1) {
                    return res.status(200).json({
                        message: "Ditolak",
                        status: "sedang memproses data lain"
                    })
                }
                crawaling(req, page, limit, date);
                return res.status(200).json({
                    message: "On Progress",
                    status: true
                })
            }
            let persentase = (prosess / limit) * 100;
            return res.status(200).json({
                message: "On Progress",
                status: persentase.toFixed(2) + '%'
            })
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
    test: async (req, res) => {
        ss(req.cache, 1, 10);
        return res.status(200).json({
            message: "success"
        })
    }

}

async function ss(cache, page, limit) {
    let x = await cache.incr(`simbg:${page}:${limit}`);
    await cache.expire(`simbg:${page}:${limit}`, 60 * 60);
    console.log(x);
}