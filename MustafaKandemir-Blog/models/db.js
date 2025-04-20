const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1:27017/mustafak';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to Database!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

module.exports = mongoose; 
