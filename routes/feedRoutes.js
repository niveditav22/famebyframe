const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

router.get('/', feedController.renderFeed);

router.get('/upload', feedController.renderUploadForm);

module.exports = router;
