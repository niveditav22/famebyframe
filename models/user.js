const mysql = require('mysql2/promise');
const pool = require("../database"); 


const User = {

    create: async function(userData) {
        const { name, username, email } = userData;
        try {
            // Execute the SQL query to insert the user into the database
            const [rows, fields] = await pool.execute(
                'INSERT INTO users (user_name, user_username, email ) VALUES (?, ?, ?) ',
                [name, username, email]
            );

            // Return the ID of the inserted user
            return rows.insertId; 
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

  
    findOne: async function(email, username) {
            // Adjust the SQL query to match the actual column names in your database
            const query = 'SELECT * FROM users WHERE email = ? AND user_username = ? LIMIT 1';
            const [rows] = await pool.execute(query, [email, username]);
            return rows[0]; // Return the first user that matches or undefined if no match
        },
    
    
    
    
    findOneById: async function(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE user_id = ?',
                [userId]
            );
    
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    },

    findUsername: async function(username) {
        // Adjust the SQL query to match the actual column names in your database
        const query = 'SELECT * FROM users WHERE user_username = ? LIMIT 1';
        const [rows] = await pool.execute(query, [username]);
        return rows[0]; // Return the first user that matches or undefined if no match
    },
};


module.exports = User;



