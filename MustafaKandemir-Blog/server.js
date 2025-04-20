const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const routers = require('./routes/routers'); 

require('./models/db');
const User = require('./models/UserSchema');
const Admin = require('./models/AdminSchema');

const app = express();
const port = process.env.PORT || "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js'))); 
app.use('/css', express.static(path.join(__dirname, 'public/css'))); 
app.use('/projects', express.static(path.join(__dirname, 'projects')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.cookies = req.cookies;  
    next();
});

app.use('/', routers);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});