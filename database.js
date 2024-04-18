require('dotenv').config(); 

const mysql = require('mysql2/promise');


const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
    port: process.env.DB_PORT, 
    waitForConnections: true,
});

// query
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');

 
        const [rows, fields] = await connection.query('SELECT * FROM users LIMIT 1');
        console.log('Query result:', rows);

        connection.release(); 
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
})();

module.exports = pool;
