const pool = require('../database');


const Image = {
    saveToDatabase: async function(caption, altText, username, filename, userId) {
        // Convert undefined parameters to null
        caption = caption !== undefined ? caption : null;
        altText = altText !== undefined ? altText : null;
        //username = username !== undefined ? username : null;
        filename = filename !== undefined ? filename : null;
       

        try {
            const postDate = new Date(); // Automatically generate the post date
            // Database query to insert the image details
            console.log("Caption:", caption, "AltText:", altText, "Username:", username, "Filename:", filename);

            await pool.execute(
                'INSERT INTO images (image_caption, image_alt_text, image_url, username, image_post_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [caption, altText, filename, username, postDate, userId]
            );
            console.log('Image inserted into database.');
        } catch (error) {
            console.error('Error saving image information to database:', error);
            throw error;
        }
    },

    findByUserId: async function(userId) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM images WHERE user_id = ?',
                [userId]
            );
            return rows;
        } catch (error) {
            console.error('Error finding images by user ID:', error);
            throw error;
        }
    },

    findByUsername: async function(username) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM images WHERE username = ?',
                [username]
            );
            return rows;
        } catch (error) {
            console.error('Error finding images by username:', error);
            throw error;
        }
    },

    getImagesWithUsernames: async () => {
        const sql = `
            SELECT images.image_url, images.image_alt_text, images.image_caption, images.image_post_date, users.user_username
            FROM images
            JOIN users ON images.user_id = users.user_id
            ORDER BY images.image_post_date DESC`;
        try {
            const [rows] = await pool.query(sql);
            return rows;
        } catch (error) {
            console.error('Error fetching images with usernames:', error);
            throw error;
        }
    }
};


module.exports = Image;



