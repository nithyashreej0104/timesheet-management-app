const mysql = require('mysql');
require('dotenv').config();

const db_Connection = mysql.createConnection({
    host: process.env.DB_HOST,
    // Prefer the new env var name `DB_USER` (keeps code aligned with README/.env.example).
    // Fallback to `DB_USERNAME` so older local .env files keep working.
    user: process.env.DB_USER || process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db_Connection.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
    } else {
        console.log('MySQL connected successfully');
    }
});

module.exports = db_Connection;