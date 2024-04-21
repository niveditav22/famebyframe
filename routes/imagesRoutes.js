const express = require('express');
const router = express.Router();
const ImageController = require('../controllers/imagesController');

router.get('/', (req, res) => {
    res.render('upload'); 
});

router.post('/', ImageController.uploadImage);


module.exports = router;
