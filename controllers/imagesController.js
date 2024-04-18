const Image = require('../models/Image');
//const resizeImage = require('../resize');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');


exports.uploadImage = async (req, res) => {
    console.log('Received upload request');

    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
            console.log('No files uploaded');
            req.flash('error', 'No file was uploaded.'); // Add a flash message for no file uploaded
            return res.status(400).redirect('/upload'); // Redirect back to the upload page
        }

        console.log('Processing file:', req.files.image.name);
        const imageFile = req.files.image;
        const caption = req.body.caption;
        const altText = req.body.altText;
        const filename = `resized-${imageFile.name}`; // Prefix filename to indicate it's resized
        const uploadPath = `./uploads/${imageFile.name}`;
        const resizedPath = `./uploads/${filename}`;

        // Move the uploaded file to the uploads directory
        await imageFile.mv(uploadPath);

        // Resize the image to a width of 400 pixels while maintaining aspect ratio
        await sharp(uploadPath)
            .resize(400, 400) // Setting height to null maintains aspect ratio
            .toFile(resizedPath);

        console.log('Saving to database');
        // Assuming saveToDatabase expects: caption, altText, username, filename, userId
        await Image.saveToDatabase(caption, altText, req.session.username, filename, req.session.userId);

        console.log('Redirecting to user page');
        req.flash('success', 'Image uploaded and resized successfully!'); // Add a flash message for successful upload
        res.redirect('/users/userPage'); // Redirect to the user's page

    } catch (error) {
        console.error('Error handling file upload:', error);
        req.flash('error', 'Error handling file upload.'); // Add a flash message for the error
        res.status(500).redirect('/upload'); // Redirect back to the upload page
    }
};




