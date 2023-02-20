const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASS,
    database: "empdebt",
    host: "localhost",
    port: "5432"
})


module.exports = pool;