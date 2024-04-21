const User = require('../models/User');

const Image = require('../models/Image'); 

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
            const images = await Image.getImagesWithUsernames();
            console.log(images);
            res.render('feed', { user, images });

        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
            console.error('Error loading feed page:', error);
            res.status(500).render('feed', { images: [] });
        }
    }
};

exports.renderUploadForm = (req, res) => {
    const username = req.session.user.username;
    res.render('upload', { username }); 
};
