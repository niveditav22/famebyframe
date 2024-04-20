const User = require('../models/User');
const Image = require('../models/Image');

exports.registerUser = async (req, res) => {
    const { name, email, username } = req.body;

    const emailRegex = /^[^@]+@[^@]+\.com$/;
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;


    try {
        if (!name || !email || !username) {
            throw new Error("Missing required fields.");
        }

        if (!emailRegex.test(email)) {
            req.flash('error', 'Invalid email format. Email must end with .com');
            return res.redirect('/register');
        }

        if (!usernameRegex.test(username)) {
            req.flash('error', 'Invalid username format. Only letters, numbers, and _ or . are allowed.');
            return res.redirect('/register');
        }
      
        const existingUser = await User.findUsername(username);
        if (existingUser) {
            
            req.flash('error', 'This username is taken. Please choose another one.');
            return res.redirect('/register');
            ;
        }

        
        const userId = await User.create({ name, username, email });

        console.log('User created with ID:', userId);

        res.redirect('/login');
    } catch (error) {
        console.error('Registration failed:', error);
        
        res.status(500).send('Registration failed. Please try again.');
    }
};



exports.loginUser = async (req, res) => {
    const { username, email } = req.body;

    try {
        if (!username || !email) {
            req.flash('error', 'Username and email are required.');
            return res.redirect('/login');
        }

        const user = await User.findOne(email, username);

        if (!user) {
            req.flash('error', 'Invalid credentials. Please check your username and email.');
            return res.redirect('/login');
        }

        req.session.userId = user.user_id;
        req.session.username = user.user_username;
        res.redirect('/feed');
    } catch (error) {
        console.error('Login failed:', error);
        req.flash('error', 'Login failed due to server error.');
        res.redirect('/login');
    }
};



exports.getUserPage = async (req, res) => {
    try {
        // Check if the user is logged in
        if (!req.session.userId) {
            console.log('No user in session, redirecting to login');
            return res.redirect('/login');
        }

        // Fetch user details based on the session userId
        const user = await User.findOneById(req.session.userId);
        if (!user) {
            console.log('User not found by ID, redirecting to login');
            // User not found, handle accordingly
            return res.redirect('/login');
        }

        // Fetch images for the logged-in user
        console.log('Fetching images for user:', req.session.username);
        const images = await Image.findByUsername(req.session.username);
        console.log('Images found:', images);

        // Render the userPage with user details and images
        res.render('userPage', { user, images });
    } catch (error) {
        console.error('Error loading user page:', error);
        // In case of an error, render the userPage with an empty images array
        // and potentially pass the error message to handle it in the view
        res.render('userPage', { user: {}, images: [], error: 'Error fetching images' });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('userPage', { user }); // Ensure you have a userProfile.ejs view
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.ensureAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
};

exports.userPage = (req, res) => {
    res.render('userPage');
};

exports.getLoggedInUserProfile = async (req, res) => {
    const userId = req.session.userId; // Assuming you store the user ID in the session
    if (!userId) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(userId); // Implement this function in your User model
        res.render('userProfile', { user }); // Render the logged-in user's profile
    } catch (error) {
        console.error('Error fetching logged-in user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Function to render any user's profile page based on username
exports.getUserProfile = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('userProfile', { user }); // Render the requested user's profile
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};




