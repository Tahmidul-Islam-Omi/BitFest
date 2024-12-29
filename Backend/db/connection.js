const config = require('../config/config');
const { Pool } = require("pg");

// Configure the PostgreSQL client pool
const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
});

pool.on("connect", () => {
    console.log("Connected to the database!");
});

// Export the query function
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
