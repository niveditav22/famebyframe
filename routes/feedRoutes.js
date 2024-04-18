// feedRoutes.js

const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');

// GET /feed route
router.get('/', feedController.renderFeed);

// GET /upload route (to render the upload form)
router.get('/upload', feedController.renderUploadForm);

module.exports = router;
