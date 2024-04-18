const express = require('express');
const session = require('express-session');
const path = require('path');
const pool = require("./database"); 
const bodyParser = require('body-parser');
const app = express();
const flash = require('express-flash');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');


const userRoutes = require('./routes/userRoutes');
const imagesRoutes = require('./routes/imagesRoutes');
const feedRoutes = require('./routes/feedRoutes');


// middleware
app.use(morgan('dev'));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// session
app.use(session({
    secret: 'walking-scott-street-feeling-like-a-stranger',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());



app.use('/public', express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}));

// Routes
app.use('/users', userRoutes);
app.use('/upload', imagesRoutes);
app.use('/feed', feedRoutes);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/uploads/resized', express.static(path.join(__dirname, 'assets', 'uploads', 'resized')));


// Define login and register routes
app.get('/login', (req, res) => {
    res.render('login'); // render login.ejs
});

app.get('/register', (req, res) => {
    res.render('register'); // render register.ejs
});

app.get('/upload', (req, res) => {
    res.render('upload');
});

app.get('/users/:username', (req, res) => {
    const username = req.params.username;
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

