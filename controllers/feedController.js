// feedController.js
const User = require('../models/User');

const Image = require('../models/Image'); // Ensure this is the correct path to your Image model

exports.renderFeed = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/login');
    } else {
        try {
            const user = await User.findOneById(userId);
            if (!user) {
                return res.redirect('/login');
            }
            req.session.user = user;

            // Fetch images with usernames
            const images = await Image.getImagesWithUsernames();
            console.log(images);
            // Render the feed view with both user and images data
            res.render('feed', { user, images });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
            console.error('Error loading feed page:', error);
            // If an error occurs, pass an empty array for images or handle the error as needed
            res.status(500).render('feed', { images: [] });
        }
    }
};

exports.renderUploadForm = (req, res) => {
    // Assuming user data is stored in the session and username is a property of the user object
    const username = req.session.user.username;
    res.render('upload', { username }); // Pass the username to the upload view
};
