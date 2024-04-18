const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imagesController');
const userController = require('../controllers/userController');
//const upload = require('../multerConfig');

// Route for rendering the upload form
router.get('/', (req, res) => {
    res.render('upload'); // Assuming you have a view named 'upload.ejs'
});

router.post('/', ImageController.uploadImage);
//router.get('/feed', ImageController.getFeedPage);

//router.post('/images/upload', upload.single('image'), ImageController.uploadImage);

module.exports = router;
