require("dotenv").config(); // To load environment variables
const { Pool } = require("pg");

// Configure the PostgreSQL client pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on("connect", () => {
    console.log("Connected to the database!");
});

// Export the query function
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
