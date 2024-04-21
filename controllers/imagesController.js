const Image = require('../models/Image');
const sharp = require('sharp');

exports.uploadImage = async (req, res) => {
    console.log('Received upload request');

    try {
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
            console.log('No files uploaded');
            req.flash('error', 'No file was uploaded.'); 
            return res.status(400).redirect('/upload'); 
        }

        console.log('Processing file:', req.files.image.name);
        const imageFile = req.files.image;
        const caption = req.body.caption;
        const altText = req.body.altText;
        const filename = `resized-${imageFile.name}`; 
        const uploadPath = `./uploads/${imageFile.name}`;
        const resizedPath = `./uploads/${filename}`;

    
        await imageFile.mv(uploadPath);


        await sharp(uploadPath)
            .resize(400, 400)
            .toFile(resizedPath);

        console.log('Saving to database');
        
        await Image.saveToDatabase(caption, altText, req.session.username, filename, req.session.userId);

        console.log('Redirecting to user page');
        req.flash('success', 'Image uploadeds uccessfully!'); 
        res.redirect('/users/userPage'); 

    } catch (error) {
        console.error('Error handling file upload:', error);
        req.flash('error', 'Error handling file upload.'); 
        res.status(500).redirect('/upload'); 
    }
};




