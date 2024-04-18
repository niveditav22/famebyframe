// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ImageController = require('../controllers/imagesController');
const upload = require('../multerConfig');

// Registration
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);


// Display user page
router.get('/userPage', userController.getUserPage);
router.get('/userPage', userController.getLoggedInUserProfile);
router.get('/:username', userController.getUserProfile);


//router.post('/images/upload', upload.single('image'), ImageController.uploadImage);



module.exports = router;
